const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    folder: "attachment",
    secure: true
  });

const uploadAttachment = async (uri, mediaType) => {

    // Add check for missing mediaType
    if (!mediaType) {
        throw new Error('Media type is required and must be either "image" or "video"');
    }

    const type = mediaType.toLowerCase();
    if(type !== 'image' && type !== 'video'){
        throw new Error('Unsupported media type. Must be "image" or "video".');
    }

    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        let result;
        
        if(type === 'image'){
            result = await cloudinary.uploader.upload(uri, options);
        } else if(type === 'video'){
            result = await cloudinary.uploader.upload(uri, {
              resource_type: "video",
              ...options  
            });
        } else {
            throw new Error(`Unsupported media type: ${mediaType}. Must be "image" or "video".`);
        }
        
        // Check if result exists before accessing its properties
        if (!result) {
            throw new Error('Upload failed: No result returned from Cloudinary');
        }
        
        return result.secure_url;
        
    } catch (error) {
        console.error(`Error uploading ${mediaType}:`, error);
        throw error;
    }
}

module.exports = { uploadAttachment };
