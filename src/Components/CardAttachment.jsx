import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { db, storage } from "../firebase.config";

const CardAttachment = (parameter) => {
    const {acceptedFiles ,getRootProps, getInputProps} = useDropzone()
    const [Attachments, setAttachments] = useState([])
    const [AttachedLinks, setAttachedLinks] = useState([])

    useEffect(() => {
        attachFile();
        getAttachments();
    }, [acceptedFiles])


    const attachLink = () =>{
        let newlink = document.getElementById("link").value;
        updateDoc(doc(db,'card',parameter.card.id),{
            attachedLink: arrayUnion(newlink)
        })
    }
    
    useEffect(()=>{
        onSnapshot(doc(db,'card',parameter.card.id),(snap)=>{
            setAttachedLinks(snap.data().attachedLink)
        })
    })

    const openPage = (link) =>{
        window.open(link)
    }

    const detachLink = (link) =>{
        updateDoc(doc(db,'card',parameter.card.id),{
            attachedLink: arrayRemove(link)
        })
    }

    const attachFile = async () =>[
        acceptedFiles.map(async (e)=>{
            const uploadRef = ref(storage, `card/${parameter.card.id}/${e.path}`)
            await uploadBytes(uploadRef, e)
        })
    ]

    const downloadFile = async (fileName) =>{
        const fileRef = ref(storage, `card/${parameter.card.id}/${fileName}`)
        const url = await getDownloadURL(fileRef);
        window.open(url);
    }

    async function detachFile(fileName){
        const fileRef = ref(storage, `card/${parameter.card.id}/${fileName}`)
        try{
            deleteObject(fileRef).then(()=>{
            getAttachments();
            })
        }catch(error){
            alert(error)
        }
    }

    async function getAttachments(){
        const listRef = ref(storage, `card/${parameter.card.id}`)
        listAll(listRef).then((res) => {
            let arr = []
            res.items.forEach((itemRef) => {
                    const data = {
                        itemRef: itemRef,
                    }
                    arr.push(data)
                    setAttachments(arr);
            });
        }).catch((error) => {
            console.log(error)
        });
    }

    return (
        <div className="space-y-3">
            <div className="w-96 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag and drop files here, or click to select files</p>
                    </div>
                </div>
            </div>
            {Attachments!==undefined && (
                <div>
                    {Attachments.map((file)=>{
                        return(
                            <div className="bg-blue p-2 h-12 w-96 rounded-md bg-blue-800 flex flex-row items-center justify-between" key={file.itemRef.name}>
                                <p className="text-white w-40">{file.itemRef.name}</p>
                                <button onClick={()=>{detachFile(file.itemRef.name)}} className="bg-red-500 hover:red-400 active:red-600 p-1 text-white rounded-lg ">Dettach File</button>
                                <button onClick={()=>{downloadFile(file.itemRef.name)}} className="bg-green-500 hover:green-400 active:green-600 p-1 text-white rounded-lg ">Download File</button>
                            </div>
                        )
                    })}
                </div>
            )}
            <div className="w-96 flex flex-row">
                <input type="text" id="link" placeholder="Input Link" className="border-2 p-1 w-72 rounded-l-lg"/>
                <button onClick={attachLink} className="w-24 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 rounded-r-lg text-white">Attach Link</button>
            </div>

            {AttachedLinks !== undefined && (
                <div>
                    {AttachedLinks.map((link)=>{
                        return(
                            <div className="bg-blue p-2 h-12 w-96 rounded-md bg-blue-800 flex flex-row items-center justify-between" key={link}>
                                <p onClick={()=>{openPage(link)}} className="text-white w-40">{link}</p>
                                <button onClick={()=>{detachLink(link)}} className="bg-red-500 hover:red-400 active:red-600 p-1 text-white rounded-lg ">Dettach Link</button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
);}
 
export default CardAttachment;