import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { TiTick } from 'react-icons/ti'
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { client } from '../utils/client';
import { SanityAssetDocument } from '@sanity/client';
import { topics } from '../utils/constants';
import { BASE_URL } from '../utils';
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';


const Upload = () => {
    const [isLoading, setIsLoading] = useState(false);  // Loading
    const [asset, setAsset] = useState<SanityAssetDocument | undefined>();  // File Uploaded
    const [wrongFileType, setWrongFileType] = useState(false);  // Unsupported file type
    const [checkFile, setCheckFile] = useState(false);  // Size of the file
    const [uploadFile, setUploadFile] = useState(false);  // Uploading Process
    const [caption, setCaption] = useState('');  // Caption
    const [demo, setDemo] = useState('');  // Caption
    const [category, setCategory] = useState(topics[0].name);  // Category
    const [savingPost, setSavingPost] = useState(false);  // Saving for Upload

    const { userProfile }: { userProfile: any } = useAuthStore();  // Current User
    const router = useRouter();

    // NEW
    const [playing, setPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const uploadVideo = async (e: any) => {
        e.preventDefault();
        const selectedFile = e.target.files[0];
        const fileTypes = ['image/png', 'image/jpeg'];
        // const fileTypes = ['video/mp4', 'video/webm', 'image/png', 'image/jpeg'];
        const imageTypes = ['image/png', 'image/jpeg'];
        const videoTypes = ['video/mp4', 'video/webm'];

        if (imageTypes.includes(selectedFile.type)) {
            setDemo('image')
        }
        else if (videoTypes.includes(selectedFile.type)) {
            setDemo('video')
        }

        if (fileTypes.includes(selectedFile.type)) {
            // Size greater than 10MB
            if (selectedFile.size > 10e6) {
                setCheckFile(true);
                // Correct File Type
                if (fileTypes.includes(selectedFile.type)) {
                    setWrongFileType(false);
                }
                else setWrongFileType(true)
                return false;
            }
            setCheckFile(false);
            setWrongFileType(false);
            setUploadFile(true);
            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name
            })
                .then((data) => {
                    setAsset(data);
                    setIsLoading(false);
                })
        }
        else {
            setIsLoading(false);
            setUploadFile(false)
            setWrongFileType(true);
            if (selectedFile.size > 10e6) {
                setCheckFile(true);
            }
            else setCheckFile(false);
        }


    };

    const handlePost = async (e: any) => {
        e.preventDefault();
        if (caption && asset?._id && category) {
            setSavingPost(true);

            const document = {
                _type: 'post',
                caption,
                video: {
                    type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: asset?._id
                    }
                },
                previewtype: demo,
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id
                },
                topic: category
            }
            await axios.post(`${BASE_URL}/api/post`, document);
            router.push('/');
        }
    };

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

    return (
        <div className="flex w-full h-full absolute left-0 top-[70px] md:top-[87px] mb-10 pt-5 md:pt-14 lg:pt-10 bg-[#F8F8F8] justify-center">
            <div className="bg-white w-[80%] rounded-lg xl:h-[80vh] md:h-[110vh] h-[110vh] flex gap-6 flex-wrap justify-evenly items-center p-14 pt-6">
                <div>
                    <div>
                        <span className="text-2xl font-bold text-[#F51997]">Upload</span><span className="text-2xl font-bold"> a Video/Image</span>
                        <p className="text-md text-gray-400 mt-1">Post to your Account</p>
                    </div>
                    <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center outline-none mt-5 w-[300px] h-[480px] cursor-pointer hover:border-red-300 hover:bg-gray-100">
                        {isLoading ?
                            (
                                <p>Uploading...</p>
                            ) :
                            (
                                <div>
                                    {asset ?
                                        (
                                            <div>
                                                {
                                                    demo === "video" ? (
                                                        <div className="rounded-3xl">
                                                            <video
                                                                loop
                                                                ref={videoRef}
                                                                src={asset.url}
                                                                className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] rounded-2xl cursor-pointer bg-gray-200 w-[350px]"
                                                            >
                                                            </video>
                                                            {/* <div className='absolute bottom-6 cursor-pointer left-8 md:left-14 lg:right-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[600px]'> */}
                                                            <div className="flex flex-row justify-evenly items-center">    
                                                                {playing ?
                                                                    (
                                                                        <button onClick={onVideoPress} >
                                                                            <BsFillPauseFill className="text-black border-2 rounded-full outline-none focus:outline-none text-2xl lg:text-4xl" />
                                                                        </button>
                                                                    ) :
                                                                    (
                                                                        <button onClick={onVideoPress} >
                                                                            <BsFillPlayFill className="text-black border-2 rounded-full outline-none focus:outline-none text-2xl lg:text-4xl" />
                                                                        </button>
                                                                    )
                                                                }
                                                                {isVideoMuted ?
                                                                    (
                                                                        <button onClick={() => setIsVideoMuted(false)}>
                                                                            <HiVolumeOff className="text-black border-2 rounded-full text-2xl outline-none focus:outline-none lg:text-4xl" />
                                                                        </button>
                                                                    ) :
                                                                    (
                                                                        <button onClick={() => setIsVideoMuted(true)}>
                                                                            <HiVolumeUp className="text-black border-2 rounded-full text-2xl outline-none focus:outline-none lg:text-4xl" />
                                                                        </button>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>) : (
                                                        <div className="rounded-3xl">
                                                            <img
                                                                src={asset.url}
                                                                className="rounded-2xl cursor-pointer bg-gray-200"
                                                                alt="Post"
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        ) :
                                        (
                                            <label className="cursor-pointer">
                                                <div className="flex flex-col items-center justify-center w-full h-full">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <p className="font-bold text-xl">
                                                            <FaCloudUploadAlt className="text-[#F51997] text-6xl" />
                                                        </p>
                                                        <p className="text-xl font-semibold text-[#F51997]">
                                                            Upload Here
                                                        </p>
                                                    </div>
                                                    {checkFile &&
                                                        (
                                                            <p className="text-red-600 mt-5 items-center">
                                                                Max File Limit is 10MB
                                                            </p>
                                                        )
                                                    }
                                                    {uploadFile &&
                                                        (
                                                            <p className="border-[#F51997] mt-5 p-2 px-4 rounded-full border-2 items-center">
                                                                Uploading...
                                                            </p>
                                                        )
                                                    }
                                                    {wrongFileType &&
                                                        (
                                                            <p className="text-red-600 mt-5 items-center">
                                                                Unsupported file type
                                                            </p>
                                                        )
                                                    }
                                                    <div className="container align-centercursor-pointer">
                                                        <input
                                                            type='file'
                                                            name='upload-video'
                                                            onChange={uploadVideo}
                                                            className='w-0 h-0'
                                                        />
                                                    </div>
                                                    <p className="text-gray-400  text-center text-sm ">
                                                        Spported File types: <br />
                                                        {/* .mp4/.webm for Videos<br /> */}
                                                        .png/.jpg/.jpeg for Images<br />
                                                        No Video files
                                                    </p>
                                                    <p className="text-gray-400 mt-5 text-center text-sm ">
                                                        Max. file size: <br />
                                                        less than 10MB<br />
                                                    </p>
                                                </div>
                                            </label>
                                        )}
                                </div>
                            )}
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-10">
                    <label className="text-md font-medium">
                        Captions
                    </label>
                    <input
                        type="text"
                        value={caption}
                        placeholder='Type in the caption here...'
                        className="rounded outline-none text-md border-2 border-gray-200 p-2"
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <label className="text-md font-medium">
                        Category
                    </label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none border-2 border-gray-200 text-md lg:p-4 p-2 rounded cursor-pointer capitalize"
                    >
                        {topics.map((topic) => (
                            <option
                                key={topic.name}
                                className="outline-none bg-white rounded-2 text-gray-700 text-md p-2 hover:bg-slate-300 capitalize"
                                value={topic.name}
                            >
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-6 mt-10">
                        <button
                            onClick={() => { }}
                            type="button"
                            className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handlePost}
                            type="button"
                            className="border-[#F51997] border-2 text-[#F51997] text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upload