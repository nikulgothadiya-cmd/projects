import { useEffect, useState } from "react";
import API, { getUploadUrl } from "../api/axios";
import { toast } from "../utils/toast";
import "./admin.css";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  

  // ✅ FETCH BOOKS
  const getBooks = async () => {
    const res = await API.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    getBooks();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ HANDLE IMAGE
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // ✅ EDIT BOOK
  const editBook = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      stock: book.stock,
      description: book.description,
    });

    setEditingId(book._id);
    setImage(null);
  };

  // ✅ ADD BOOK
  const addBook = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", image);

      await API.post("/books",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Book added successfully");

      resetForm();
      getBooks();
    } catch {
      toast.error("Error adding book");
    }
  };

  // ✅ UPDATE BOOK
  const updateBook = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/books/${editingId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Book updated successfully");

      resetForm();
      getBooks();
    } catch {
      toast.error("Error updating book");
    }
  };

  // ✅ DELETE BOOK
  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/books/${id}`);

      toast.success("Book deleted successfully");

      getBooks();
    } catch {
      toast.error("Error deleting book");
    }
  };

  // ✅ RESET FORM
  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      author: "",
      price: "",
      stock: "",
      description: "",
    });
    setImage(null);
  };

  return (
    <div className="manage-books">
      {/* Header Section */}
      <div className="books-header">
        <div className="header-content">
          <h1 className="books-title">📚 Book Inventory</h1>
          <p className="books-subtitle">Manage your book catalog and inventory</p>
        </div>
        <div className="books-stats">
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-info">
              <span className="stat-number">{books.length}</span>
              <span className="stat-label">Total Books</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-number">{books.reduce((sum, b) => sum + b.stock, 0)}</span>
              <span className="stat-label">Total Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Section */}
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">
              {editingId ? "✏️ Edit Book" : "➕ Add New Book"}
            </h2>
            {editingId && (
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Book Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={form.author}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                placeholder="Enter stock quantity"
                value={form.stock}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Enter book description"
                value={form.description}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label className="file-upload-label">
                <span className="upload-icon">📸</span>
                <span className="upload-text">
                  {image ? "✓ Image Selected" : "Click to upload image"}
                </span>
                <input type="file" onChange={handleImage} hidden />
              </label>
            </div>

            {image && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="preview-img"
                />
                <span className="preview-label">Preview</span>
              </div>
            )}
          </div>

          <button
            className={`submit-btn ${editingId ? "update" : "add"}`}
            onClick={editingId ? updateBook : addBook}
          >
            {editingId ? "✏️ Update Book" : "✨ Add Book"}
          </button>
        </div>
      </div>

      {/* Books Table Section */}
      <div className="books-table-container">
        <div className="table-header">
          <h3>Books Catalog ({books.length})</h3>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books yet</h3>
            <p>Start by adding your first book using the form above.</p>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((b) => (
                  <tr key={b._id} className="book-row">
                    <td>
                      <div className="book-image-cell">
                        <img
                          src={
                            b.image
                              ? getUploadUrl(b.image)
                              : "/no-image.png"
                          }
                          className="table-img"
                          alt={b.title}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="book-title-cell">
                        <div className="book-title">{b.title}</div>
                      </div>
                    </td>
                    <td>
                      <div className="book-author">{b.author}</div>
                    </td>
                    <td>
                      <div className="book-price">₹{b.price}</div>
                    </td>
                    <td>
                      <div className={`stock-badge ${b.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {b.stock} {b.stock === 1 ? "copy" : "copies"}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => editBook(b)}
                          title="Edit Book"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteBook(b._id)}
                          title="Delete Book"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



