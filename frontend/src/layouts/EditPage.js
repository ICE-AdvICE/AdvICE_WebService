import BlogForm from "../components/BlogForm";
import './css/EditPage.css';
const EditPage = () => {
    return(
        <div>
            <BlogForm editing = {true} />
        </div>    
    )
};
export default EditPage;