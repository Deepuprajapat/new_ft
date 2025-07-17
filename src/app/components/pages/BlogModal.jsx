import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { SaveNewBlog, EditBlog } from "../../apis/api";

const BlogModal = ({ open, onClose, initialData, mode, onSuccess }) => {
  const [form, setForm] = useState({
    blog_url: "",
    blog_content: {
      title: "",
      description: "",
      image: "",
      image_alt: ""
    },
    seo_meta_info: {
      blog_schema: "",
      canonical: "",
      title: "",
      keywords: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        blog_url: initialData.blog_url || "",
        blog_content: {
          title: initialData.blog_content?.title || "",
          description: initialData.blog_content?.description || "",
          image: initialData.blog_content?.image || "",
          image_alt: initialData.blog_content?.image_alt || ""
        },
        seo_meta_info: {
          blog_schema: initialData.seo_meta_info?.blog_schema || "",
          canonical: initialData.seo_meta_info?.canonical || "",
          title: initialData.seo_meta_info?.title || "",
          keywords: initialData.seo_meta_info?.keywords || ""
        }
      });
    } else {
      setForm({
        blog_url: "",
        blog_content: {
          title: "",
          description: "",
          image: "",
          image_alt: ""
        },
        seo_meta_info: {
          blog_schema: "",
          canonical: "",
          title: "",
          keywords: ""
        }
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("blog_content.")) {
      setForm({
        ...form,
        blog_content: {
          ...form.blog_content,
          [name.replace("blog_content.", "")]: value
        }
      });
    } else if (name.startsWith("seo_meta_info.")) {
      setForm({
        ...form,
        seo_meta_info: {
          ...form.seo_meta_info,
          [name.replace("seo_meta_info.", "")]: value
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      // Simulate upload: in real app, upload to S3 or server and get URL
      // Here, use a local URL for preview (replace with real upload logic)
      const url = URL.createObjectURL(file);
      setForm({
        ...form,
        blog_content: {
          ...form.blog_content,
          image: url
        }
      });
      // In production, replace above with actual upload and set the returned URL
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      // Send blog_schema as an array
      const submitData = {
        ...form,
        seo_meta_info: {
          ...form.seo_meta_info,
          blog_schema: form.seo_meta_info.blog_schema
            ? [form.seo_meta_info.blog_schema]
            : []
        }
      };
      if (mode === "edit" && initialData && initialData.id) {
        await EditBlog(submitData, initialData.id);
      } else {
        await SaveNewBlog(submitData);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        <h2>{mode === "edit" ? "Edit Blog" : "Add New Blog"}</h2>
        <TextField
          label="Blog URL"
          name="blog_url"
          value={form.blog_url}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Title"
          name="blog_content.title"
          value={form.blog_content.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="blog_content.description"
          value={form.blog_content.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={8}
          InputProps={{
            style: { padding: '12px' }
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ margin: "10px 0" }}
          disabled={imageUploading}
        />
        {imageUploading && <span>Uploading...</span>}
        {form.blog_content.image && (
          <div style={{ margin: "10px 0" }}>
            <img src={form.blog_content.image} alt="Preview" style={{ maxWidth: 200, maxHeight: 120 }} />
          </div>
        )}
        <TextField
          label="Image Alt Text"
          name="blog_content.image_alt"
          value={form.blog_content.image_alt}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Schema (JSON string)"
          name="seo_meta_info.blog_schema"
          value={form.seo_meta_info.blog_schema}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Canonical URL"
          name="seo_meta_info.canonical"
          value={form.seo_meta_info.canonical}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Meta Title"
          name="seo_meta_info.title"
          value={form.seo_meta_info.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Meta Keywords (comma separated)"
          name="seo_meta_info.keywords"
          value={form.seo_meta_info.keywords}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {mode === "edit" ? "Save Changes" : "Add Blog"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlogModal; 