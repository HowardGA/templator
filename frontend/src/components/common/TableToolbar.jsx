import { Space, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const TableToolbar = ({ selectedItem, onView, onEdit, onDelete, onCreate, disableCreate }) => {
    return (
        <Space style={{marginBottom: '1rem'}}>
            <Button
                icon={<EyeOutlined />}
                disabled={!selectedItem}
                onClick={() => onView?.(selectedItem)}
            >
                View
            </Button>
            <Button
                icon={<EditOutlined />}
                disabled={!selectedItem}
                onClick={() => onEdit?.(selectedItem)}
            >
                Edit
            </Button>
            <Button
                icon={<DeleteOutlined />}
                danger
                disabled={!selectedItem}
                onClick={() => onDelete?.(selectedItem)}
            >
                Delete
            </Button>
            {!disableCreate && (
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => onCreate?.()}
                >
                    Create
                </Button>
            )}
        </Space>
    );
};

export default TableToolbar;
