import { Divider, Row, Col } from "antd";
import MainFormDetails from "./MainFormDetails";
import QuestionMaker from "./QuestionMaker";


const TemplateCreatorForm = () => {
    return (
        <div style={{display:'flex', flexDirection: 'column', gap:'2rem', width:'100%', alignItems:'center'}}>
            <MainFormDetails />
            <QuestionMaker />
        </div>
    );
}

export default TemplateCreatorForm;