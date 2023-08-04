const BlogForm = (addBlog, newTitle, setNewTitle, newAuthor, setNewAuthor, newURL, setNewURL) => (
  <form onSubmit={addBlog}>
    <table>
      <thead> Create New Blog </thead>
      <tbody>
        <tr>
          <th> Title </th>
          <th><input
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
          </th>
        </tr>
        <tr>
          <th> Author </th>
          <th><input
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
          </th>
        </tr>
        <tr>
          <th> URL </th>
          <th><input
            value={newURL}
            onChange={({ target }) => setNewURL(target.value)}
          />
          </th>
        </tr>
      </tbody>
    </table>
    <button type="submit">save</button>
  </form> 
)

export default BlogForm;
