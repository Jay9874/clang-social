import React, { useState, useEffect, useRef } from 'react';
import { Video } from '../types';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';

// NEW
import useAuthStore from '../store/authStore';  // Added from Details
import LikeButtonHome from './LikeButtonHome';  // Added from Details -->  No Actions
import LikeButtonNo from './LikeButtonNo';  // Added from Details --> Like, Dislike
import { BASE_URL } from '../utils';  // Added from Details
import axios from 'axios';  // Added from Details
import CommentsHome from './CommentsHome'; // Add from Details --> Comment

interface IProps {
    post: Video
}

const VideoCard: NextPage<IProps> = ({ post }: any) => {
    const [isHover, setIsHover] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { userProfile }: any = useAuthStore();  // Added from Details --> Like/Comment
    const [postUser, setPostUser] = useState(post);  // Added from Details --> Like
    const [comment, setComment] = useState('');  // Added from Details--> Comment
    const [isPostingComment, setIsPostingComment] = useState(false);  // Added from Details --> Comment
    const [postComment, setPostComment] = useState(post);  // Added from Details --> Comment

    const onVideoPress = () => {
        if (playing) {
            videoRef?.current?.pause();
            setPlaying(false);
        }
        else {
            videoRef?.current?.play();
            setPlaying(true);
        }
    }

    // LIKE/DISLIKE
    const handleLike = async (like: boolean) => {
        if (userProfile) {
            const { data } = await axios.put(`${BASE_URL}/api/like`, {
                userId: userProfile._id,
                postId: post._id,
                like
            })

            setPostUser({ ...post, likes: data.likes });
        }
    }

    // COMMENT
    const addComment = async (e: any) => {
        e.preventDefault();

        if (userProfile && comment) {
            setIsPostingComment(true);

            const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
                userId: userProfile._id,
                comment
            });

            setPostComment({ ...postComment, comments: data.comments });
            setComment('');
            setIsPostingComment(false);
        }
    }

    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [isVideoMuted])

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

    return (
        <div className="flex flex-col border-b-2 border-gray-200 pb-6 mr-5">
            <div>
                <div className="flex gap-3 p-2 font-semibold rounded ">
                    <div className="md:w-16 cursor-pointer md:h-16 w-10 h-10">
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <img
                                width={62}
                                height={62}
                                className="rounded-full"
                                src={post.postedBy.image}
                                alt="Profile Photo"
                                referrerPolicy="no-referrer"
                            />
                        </Link>
                    </div>
                    <div>
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <div className="flex justify-start items-start flex-col cursor-pointer">
                                <p className="flex gap-2 font-semibold items-center md:text-md text-primary">
                                    {post.postedBy.userName} {`
                                    `}
                                    <GoVerified className="text-blue-400 text-md" />
                                </p>
                                <p className="lowercase font-medium text-xs text-gray-500">
                                    {`@${post.postedBy.userName.replace(' ','')}`}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="lg:ml-20 flex gap-4 relative justify-center items-center">
                {
                    post.previewtype === 'video' ? (
                        <div
                            onMouseEnter={() => setIsHover(true)}
                            onMouseLeave={() => setIsHover(false)}
                            className="rounded-3xl"
                        >
                            <Link href={`/detail/${post._id}`}>
                                <video
                                    loop
                                    ref={videoRef}
                                    src={post.video.asset.url}
                                    className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] rounded-2xl cursor-pointer bg-gray-200 w-[350px]"
                                >
                                </video>
                            </Link>
                            <div className="absolute top-[50%] left-[45%] cursor-pointer">
                                {!playing && (
                                    <button
                                        onClick={onVideoClick}
                                    >
                                        <BsFillPlayFill className="text-white text-4xl lg:text-6xl" />
                                    </button>
                                )}
                            </div>

                            <div className='absolute bottom-2 cursor-pointer lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]'>
                                {isVideoMuted ?
                                    (
                                        <button onClick={() => setIsVideoMuted(false)}>
                                            <HiVolumeOff className="text-black border-2 rounded-full text-2xl bg-white outline-none focus:outline-none lg:text-4xl" />
                                        </button>
                                    ) :
                                    (
                                        <button onClick={() => setIsVideoMuted(true)}>
                                            <HiVolumeUp className="text-black border-2 rounded-full bg-white text-2xl outline-none focus:outline-none lg:text-4xl" />
                                        </button>
                                    )
                                }
                            </div>
                        </div>) : (
                        <div className="rounded-3xl">
                            <Link href={`/detail/${post._id}`}>
                                <img
                                    src={post.video.asset.url}
                                    className="rounded-2xl cursor-pointer bg-gray-200"
                                    alt="Post"
                                />
                            </Link>
                        </div>
                    )
                }
            </div>
            <div className='flex flex-col justify-center items-center'>
                {/* <div className="flex justify-center items-center"> */}
                {userProfile ?
                    (
                        <LikeButtonHome
                            likes={postUser.likes}
                            handleLike={() => handleLike(true)}
                            handleDislike={() => handleLike(false)}
                        />

                    ) :
                    (
                        <LikeButtonNo
                            likes={postUser.likes}
                            handleLike={() => { }}
                            handleDislike={() => { }}
                        />
                    )
                }
                <CommentsHome
                    comment={comment}
                    setComment={setComment}
                    addComment={addComment}
                    comments={post.comments}
                    isPostingComment={isPostingComment}
                />
            </div>
        </div>
    )
}

export default VideoCard