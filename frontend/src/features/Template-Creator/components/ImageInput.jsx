import { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { uploadImageToImgBB, deleteImageFromImgBB } from '../services/SettingsTabServices';
import { useAntdApi } from '../../../contexts/MessageContext';

const { Dragger } = Upload;

const ImageInput = ({ onImageUploaded }) => {
    const { message: messageApi } = useAntdApi();
    const [fileList, setFileList] = useState([]);
    const [currentImage, setCurrentImage] = useState({
        url: null,
        deleteUrl: null,
        file: null
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = async (info) => {
        const newFileList = info.fileList.slice(-1);
        
        if (newFileList.length === 0) {
            if (currentImage.deleteUrl) {
                try {
                    await deleteImageFromImgBB(currentImage.deleteUrl);
                    messageApi.success('Image removed successfully');
                } catch (error) {
                    console.warn('Failed to delete image:', error);
                }
            }
            setCurrentImage({ url: null, deleteUrl: null, file: null });
            onImageUploaded(null);
            setFileList([]);
            return;
        }

        const newFile = newFileList[0];
        if (newFile.originFileObj) {
            try {
                setUploading(true);
                
                if (currentImage.deleteUrl) {
                    await deleteImageFromImgBB(currentImage.deleteUrl);
                }

                const { url, deleteUrl } = await uploadImageToImgBB(newFile.originFileObj);
                
                setCurrentImage({ url, deleteUrl, file: newFile.originFileObj });
                onImageUploaded(url);
                setFileList([{
                    ...newFile,
                    status: 'done',
                    url: url,
                    thumbUrl: url
                }]);
            } catch (error) {
                messageApi.error('Image upload failed');
                console.log(error)
                setFileList(currentImage.url ? [{
                    uid: '-1',
                    name: 'current-image',
                    status: 'done',
                    url: currentImage.url,
                    thumbUrl: currentImage.url
                }] : []);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleBeforeUpload = (file) => {
        const isJpgOrPng = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
        if (!isJpgOrPng) {
            messageApi.error('Only JPG/PNG/JPEG files are allowed!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            messageApi.error('Image must be smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    useEffect(() => {
        return () => {
            if (currentImage.deleteUrl) {
                deleteImageFromImgBB(currentImage.deleteUrl).catch(console.warn);
            }
        };
    }, [currentImage.deleteUrl]);

    const uploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        listType: 'picture',
        accept: '.jpg,.jpeg,.png',
        showUploadList: true,
        fileList,
        beforeUpload: handleBeforeUpload,
        onChange: handleChange,
        disabled: uploading,
        customRequest: ({ onSuccess }) => onSuccess("ok")
    };

    return (
        <div>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    {uploading ? 'Uploading...' : 'Click or drag image to upload'}
                </p>
                <p className="ant-upload-hint">
                    Support for a single image (max 2MB)
                </p>
            </Dragger>
            {uploading && <div style={{ marginTop: 8 }}>Uploading new image...</div>}
        </div>
    );
};

export default ImageInput;