import { useState, useEffect } from "react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import axios from "axios";

import VideoCardProfile from "../../components/VideoCardProfile";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import { BASE_URL } from "../../utils";

interface IProps {
    data: {
        user: IUser,
        userVideos: Video[],
        userLikedVideos: Video[]
    }
}

const Profile = ({ data }: IProps) => {
    const [showUserVideos, setShowUserVideos] = useState(true);
    const [videosList, setVideosList] = useState<Video[]>([]);
    const { user, userVideos, userLikedVideos } = data;

    const videos = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'
    const liked = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400'

    useEffect(() => {
        if (showUserVideos) {
            setVideosList(userVideos);
        }
        else {
            setVideosList(userLikedVideos);
        }
    }, [showUserVideos, userLikedVideos, userVideos]);

    return (
        <div className="w-full ">
            <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
                <div className="border-4 text-md font-semibold flex items-center rounded-full">
                    <Image width={75} height={75} className='rounded-full' alt='user-profile' src={user?.image} />
                </div>

                <div className="flex flex-col justify-center">
                    <p className="capitalize md:text-2xl tracking-wider flex gap-1 items-center justify-center text-md font-bold text-primary">
                        {user?.userName}
                        <GoVerified className="text-blue-400" />
                    </p>
                    <p className="lowercase md:text-xl text-gray-400 text-xs">
                        {`@${user?.userName.replace(' ', '')}`}
                    </p>
                </div>
            </div>

            <div >
                <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                    <p
                        className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
                        onClick={() => setShowUserVideos(true)}
                    >POSTS</p>
                    {/* <p 
                        className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
                        onClick={() => setShowUserVideos(false)}
                    >LIKED</p> */}
                </div>

                <div className="flex gap-6 flex-wrap md:justify-start">
                    {videosList.length > 0 ? (
                        videosList.map((post: Video, idx: number) => (
                            <VideoCardProfile post={post} key={idx} />
                        ))
                    ) : (
                        <NoResults text={`No ${showUserVideos ? '' : 'Liked'} Posts yet`} />
                    )}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`)

    return {
        props: { data: res.data }
    }
}

export default Profile

