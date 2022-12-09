import React, { useState, useRef } from 'react';
// import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import useAuthStore from '../../store/authStore';  // Add this to main VideoCard  --> Like/Comment
import LikeButton from '../../components/LikeButton';  // Add this to main VideoCard
import Comments from '../../components/Comments';  // Add this to main VideoCard  --> Comment
import { BiArrowBack } from 'react-icons/bi';
import { RxCross1 } from 'react-icons/rx'


interface IProps {
  postDetails: Video
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost]: any = useState(postDetails);  // CHANGED
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();  // Add this to main VideoCard --> Like/Comment
  const [comment, setComment] = useState('');  // Add this to main VideoCard --> Comment
  const [isPostingComment, setIsPostingComment] = useState(false);  // Add this to main VideoCard --> Comment

  const onVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    }
    else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  }

  // useEffect(() => {
  //   if (post && videoRef?.current) {
  //     videoRef.current.muted = isVideoMuted;
  //   }
  // }, [post, isVideoMuted]);

  if (post && videoRef?.current) {
    videoRef.current.muted = isVideoMuted;
  }

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like
      })

      setPost({ ...post, likes: data.likes });
    }
  }

  // Add this to VideoCard  --> Comment
  const addComment = async (e: any) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);

      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment
      });

      setPost({ ...post, comments: data.comments });
      setComment('');
      setIsPostingComment(false);
    }
  };

  const [visible, setVisible] = useState(true);

  if (!post) return null;

  return (
    <div className="flex w-full justify-center absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
      {post.previewtype === 'video' ? (
        <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
          <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
            <p className="cursor-pointer" onClick={() => router.back()}>
              <MdOutlineCancel className="text-white text-[35px]" />
            </p>
          </div>
          <div className="relative">
            <div className='lg:h-[100vh] h-[60vh]'>
              <video
                ref={videoRef}
                onClick={onVideoClick}
                loop
                src={post?.video?.asset.url}
                className=' h-full cursor-pointer'
              ></video>
            </div>
            <div className="absolute top-[45%] left-[45%] cursor-pointer">
              {!playing && (
                <button
                  onClick={onVideoClick}
                >
                  <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
                </button>
              )}
            </div>
          </div>
          <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
            {isVideoMuted ?
              (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-2xl outline-none lg:text-4xl" />
                </button>
              ) :
              (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-2xl outline-none lg:text-4xl" />
                </button>
              )
            }
          </div>
        </div>) : (
        <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
          <div className="absolute top-10 left-2 lg:left-6 flex gap-6 z-50">
            <p className="cursor-pointer" onClick={() => router.back()}>
              <RxCross1 className="text-[#F51997] text-[35px]" />
            </p>
          </div>
          <div className="relative">
            <div className="lg:h-[100vh] h-[60vh] flex flex-col justify-center items-center w-auto">
              <img
                src={post?.video?.asset.url}
                className="rounded-lg"
                alt="Post"
              />
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden lg:hidden">
        {userProfile && (
          <LikeButton
            likes={post.likes}
            handleLike={() => handleLike(true)}
            handleDislike={() => handleLike(false)}
          />
        )}
      </div>

      <div className="relative w-[1000px]  md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-0 md:mt-5">
          <div className="flex gap-3 p-2 font-semibold  pt-7 rounded">
            <div className="ml-4 md:w-20 cursor-pointer  md:h-20 w-16 h-16">
              <Link href={`/profile/${postDetails.postedBy._id}`}>
                <Image
                  width={62}
                  height={62}
                  className="rounded-full"
                  src={post.postedBy.image}
                  alt="Profile Photo"
                  layout="responsive"
                />
              </Link>
            </div>
            <div>
              <Link href={`/profile/${postDetails.postedBy._id}`}>
                <div className=" cursor-pointer flex flex-col gap-2">
                  <p className="flex gap-2 items-center font-semibold text-xl md:text-md text-primary">
                    {post.postedBy.userName} {`  `}
                    <GoVerified className="text-blue-400 text-md" />
                  </p>
                  <p className="lowercase font-medium text-xs text-gray-500">
                    {`@${post.postedBy.userName.replace(' ', '')}`}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <p className="px-10 text-lg text-gray-600">{post.caption}</p>

          {/* Add in VideoCard --> Like */}
          <div className="mt-2 mb-2 px-10 hidden md:block lg:block">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>

          {/* Add in VideoCard --> Comment */}
          <Comments
            comment={comment}
            setComment={setComment}
            addComment={addComment}
            comments={post.comments}
            isPostingComment={isPostingComment}
          />
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)

  return {
    props: { postDetails: data }
  }
}

export default Detail