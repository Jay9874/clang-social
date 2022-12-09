import React, { useState, useEffect } from 'react';
import { MdFavorite } from 'react-icons/md';
import useAuthStore from '../store/authStore';

interface IProps {
    handleLike: () => void;
    handleDislike: () => void;
    likes: any[];
}

const LikeButton = ({ likes, handleLike, handleDislike }: IProps) => {
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const { userProfile }: any = useAuthStore();
    const filterLikes = likes?.filter((item) => item._ref === userProfile?._id);

    useEffect(() => {
        if (filterLikes?.length > 0) {
            setAlreadyLiked(true);
        }
        else {
            setAlreadyLiked(false);
        }
    }, [filterLikes, likes])

    return (
        <div className="flex gap-6">
            <div className="mt-4 flex gap-1 flex-row justify-center items-center">
                {alreadyLiked ?
                    (
                        <div
                            className="bg-primary cursor-pointer rounded-full p-2 md:p-4 text-[#F51997]" //DeprecationWarning: uuidv4() is deprecated. Use v4() from the uuid module instead.
                            onClick={handleDislike}
                        >
                            <MdFavorite className="text-lg md:text-2xl" />
                        </div>
                    ) :
                    (
                        <div
                            className="bg-primary cursor-pointer rounded-full p-2 md:p-4"
                            onClick={handleLike}
                        >
                            <MdFavorite className="text-lg md:text-2xl" />
                        </div>
                    )

                }
                <p className="text-md font-semibold">
                    {likes?.length || 0}
                </p>
            </div>
        </div>
    )
}

export default LikeButton