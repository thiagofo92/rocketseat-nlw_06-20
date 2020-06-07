import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'


import './styles.css';


interface Props {
    onFileUpLoaded: (file: File) => void
}

const Dropzone : React.FC<Props>= ({onFileUpLoaded}) => {


    const [selectedFileUrl, setSelectedFileURl] = useState('');
    const onDrop = useCallback(acceptedFiles => 
    {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileURl(fileUrl);
        onFileUpLoaded(file);
    }, [onFileUpLoaded])
    
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'

    })

    return (
        <div className='dropzone'{...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {
                selectedFileUrl ?
                    <img src={selectedFileUrl} alt="Point thumbnail" />
                    : (
                        <p>
                            <FiUpload />
                            Imagem estabelecimento
                        </p>

                    )
            }
        </div>
    )
}

export default Dropzone;