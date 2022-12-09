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
import LikeButtonNo from './LikeButtonNo';  // Added from Details -->  No Actions
import LikeButtonProfile from './LikeButtonProfile';  // Added from Details --> Like, Dislike
import { BASE_URL } from '../utils';  // Added from Details
import axios from 'axios';  // Added from Details
import CommentsHome from './CommentsHome'; // Add from Details --> Comment


interface IProps {
    post: Video
}

const VideoCardProfile: NextPage<IProps> = ({ post }) => {
    const [isHover, setIsHover] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { userProfile }: any = useAuthStore();  // Added from Details --> Like/Comment
    const [postUser, setPostUser] = useState(post);  // Added from Details --> Like

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

    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [isVideoMuted])

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

    return (
        <div className="flex flex-col border-b-2 border-gray-200 pb-6 mr-5">
            <div className="lg:ml-20 flex gap-4 relative justify-center items-center">
                {post.previewtype === 'video' ?
                    (
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
                            
                            <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:right-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]'>
                                {playing ?
                                    (
                                        <button onClick={onVideoPress} >
                                            <BsFillPauseFill className="text-black border-2 rounded-full bg-white outline-none focus:outline-none text-2xl lg:text-4xl" />
                                        </button>
                                    ) :
                                    (
                                        <button onClick={onVideoPress} >
                                            <BsFillPlayFill className="text-black border-2 rounded-full bg-white outline-none focus:outline-none text-2xl lg:text-4xl" />
                                        </button>
                                    )
                                }
                            </div>
                            <div className='absolute bottom-6 cursor-pointer right-0 lg:left-3/4 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]'>
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
                        </div>
                    ) : 
                    (
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
                {userProfile ?
                    (
                        <LikeButtonProfile
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
                    )}
            </div>
        </div>
    )
}

export default VideoCardProfile


