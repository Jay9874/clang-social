import React, { useState, useEffect, useRef } from 'react';
import { Video } from '../types';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs';
import { GoVerified } from 'react-icons/go';
import { TfiReload } from 'react-icons/tfi';

interface IProps {
    post: Video
}

const VideoCardSearch: NextPage<IProps> = ({ post }) => {
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

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

    const [toggle, setToggle] = useState(true)

    return (
        <div className="flex flex-col gap-10 border-b-2 border-gray-200 pb-6 mr-5">
            <div className="lg:ml-20 flex gap-4 relative justify-center items-center">
                <div className="rounded-3xl">
                    <button
                        onClick={() => setToggle(!toggle)}
                        className="btn flex gap-5 justify-center items-center btn-primary mb-5"
                    >
                        <TfiReload className="w-5 h-5 text-[#F51997]" />
                        <p>Reload</p>
                    </button>
                    <Link href={`/detail/${post._id}`}>
                        <div>
                            {toggle ? (
                                <img
                                    ref={imageRef}
                                    src={post.video.asset.url}
                                    className="rounded-2xl cursor-pointer bg-gray-200"
                                    alt={post.caption}
                                />
                            ) : (
                                <div>
                                    <video
                                        loop
                                        ref={videoRef}
                                        src={post.video.asset.url}
                                        className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] rounded-2xl cursor-pointer bg-gray-200 w-[350px]"
                                    />

                                </div>
                            )}
                        </div>
                    </Link>
                    {/* {post.previewtype === "video" && (   
                    <div>
                        <div className="absolute top-[50%] left-[45%] cursor-pointer">
                            {!playing && (
                                <button
                                    onClick={onVideoClick}
                                >
                                    <BsFillPlayFill className="text-white text-4xl lg:text-6xl" />
                                </button>
                            )}
                        </div><div className='absolute bottom-2 cursor-pointer lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]'>
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
                                )}
                        </div>
                    </div>)} */}
                </div>
            </div>
        </div>
    )
}

export default VideoCardSearch