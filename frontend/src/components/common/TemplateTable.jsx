import { Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const TemplatesTable = ({ templates, onSelectRow }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Creator',
      dataIndex: 'creator',
      sorter: (a, b) => {
        const nameA = `${a.creator?.firstName || ''} ${a.creator?.lastName || ''}`.trim();
        const nameB = `${b.creator?.firstName || ''} ${b.creator?.lastName || ''}`.trim();
        return nameA.localeCompare(nameB);
      },
      render: (creator) => `${creator?.firstName || ''} ${creator?.lastName || ''}`.trim(),
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      render: (topic) => topic?.name || '-',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags) =>
        tags.map(({ tag }) => (
          <Tag key={tag.id} color="blue">
            {tag.name}
          </Tag>
        )),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Responses',
      dataIndex: ['_count', 'forms'],
      sorter: (a, b) => a._count.forms - b._count.forms,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={templates}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => {onSelectRow?.(record)},
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default TemplatesTable;
