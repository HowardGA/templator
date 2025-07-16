import { Modal, Typography } from "antd";
const { Text } = Typography;
const OdooTokenModal = ({ isModalOpen, odooToken, onCancel}) => {
    return (
        <Modal
        open = {isModalOpen}
        onCancel = {onCancel}
        footer = {null}
        title = "Your Odoo API Token"
    >
        <Typography.Paragraph copyable={{ tooltips: ['Copy token', 'Copied!'] }}>
            {odooToken || 'No token available.'}
        </Typography.Paragraph>
        <Text type="secondary">
            Use this token when importing your templates in the Odoo app.
        </Text>
    </Modal>
    );
}

export default OdooTokenModal;