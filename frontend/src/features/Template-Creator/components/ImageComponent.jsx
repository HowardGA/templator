import PlaceHolderImg from '../../../assets/placeholder.png';

const ImageComponent = () => {
    return (
        <img
            src={PlaceHolderImg}
            alt='cover image'
            style={{
                width: '100%',
                height: '16rem',
                objectFit: 'cover',
                borderRadius: '8px',
            }}
        />
    );
}

export default ImageComponent;