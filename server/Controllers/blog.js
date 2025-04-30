const Blog = require('../models/Blogs');
const { objectTrim ,checkConditionMulti} = require('../Utils/utils');
require('dotenv').config();
const BaseUrl =  process.env.BaseUrl
const path = require('path');
const fs = require('fs');



const CreateBlog = async(req,res)=>{
    try{
        req.body = objectTrim(req.body);
        const { user } = req;
        const author = user.name;
        const {title ,description}=req.body;
        const image = `${req?.file?.filename}`;
        
        if(checkConditionMulti([title,description])){

            let isBlog= await Blog.findOne({ title });

            if(!isBlog){
                const newBlog= new Blog({
                    title,
                    description,
                    author,
                    image:typeof image=="undefined"?"":image
                })
                await newBlog.save()
                res.status(200).json({ message: 'Blog is Saved Successfully'})
            }else{
                const oldImageFullPath = image!="undefined" ? path.join(__dirname, '../public', 'images', req.file.filename):"";
                if (fs.existsSync(oldImageFullPath)) {
                    try {
                        fs.unlinkSync(oldImageFullPath); // Delete the image The Blog doesnt get saved. 
                    } catch (err) {
                        return res.status(500).json({ error: "Failed to delete old image: " + err.message });
                    }
                }
                return res.status(400).json({error:'Same Blog Title Already Exist'})
            }

        }else{
            
            return res.status(400).json({error:"Give the required details"})
        }
        
        
    }catch(error){
        console.log(error)
        res.status(500).json({error:error.message})
    }
}



const Blogs = async (req, res) => {
    try {
        req.body = objectTrim(req.body);
        const { page = 1} = req.query; 
        const limit =10;

        const pageNumber = parseInt(page);

        const totalBlogs = await Blog.countDocuments();

         //       pagination of  blogs
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limit)
            .limit(limit);

        res.status(200).json({
            currentPage: pageNumber,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs,
            blogs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const BlogById = async (req, res) => {
    try {
        req.body = objectTrim(req.body);
        const id = req.params.id; 

        const blogs = await Blog.findById(id);

        res.status(200).json({
            blogs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const UpdateBlog = async (req, res) => {

    try {
        req.body=objectTrim(req.body)
        const { id,title, description } = req.body;
        let image = req?.file?.filename;
        // Check if a different blog already has the same title
        const existingBlog = await Blog.findOne({ title, _id: { $ne: id } });
        if (existingBlog) {
            return res.status(400).json({ error: "A blog with this title already exists" });
        }

        const blog = await Blog.findById(id);
          if (!blog) {
              return res.status(404).json({ error: "Blog not found" });
          }
  
          let oldImagePath = blog.image; // Assuming 'image' field contains the file path
          // Check if the image is being updated
          if (image && oldImagePath !== image) {
              // Delete the old image from the server (public/images)
              const oldImageFullPath = path.join(__dirname, '../public', 'images', oldImagePath);
              if (fs.existsSync(oldImageFullPath)) {
                try {
                    console.log(oldImageFullPath)
                    fs.unlinkSync(oldImageFullPath); // Delete the old image
                } catch (err) {
                    return res.status(500).json({ error: "Failed to delete old image: " + err.message });
                }
            }
          }


        image = req?.file?.filename;
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, description, image: typeof image=="undefined"?"":image },
            { new: true, }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};



const DeleteBlog = async (req, res) => {
    try {
        const { id } = req.body;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        console.log(deletedBlog);
        const oldImageFullPath = path.join(__dirname, '../public', 'images', deletedBlog.image);
        if (fs.existsSync(oldImageFullPath)) {
          try {
              console.log(oldImageFullPath)
              fs.unlinkSync(oldImageFullPath); // Delete the old image
          } catch (err) {
              return res.status(500).json({ error: "Failed to delete old image: " + err.message });
          }
      }

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const SearchBlog = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === "") {
            const blogs = await Blog.find({}).sort({createdAt:-1}).skip(0).limit(10)
            return res.status(200).json({ data: blogs });
        }

        // Case-insensitive search for titles containing the keyword
        const blogs = await Blog.find({
            title: { $regex: keyword, $options: 'i' }
        });

        res.status(200).json({ data: blogs });
    } catch (error) {console.log(error)
        res.status(500).json({ error: error });
    }
};



module.exports = {CreateBlog ,Blogs ,DeleteBlog ,UpdateBlog ,SearchBlog ,BlogById }