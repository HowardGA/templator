import { Table } from 'antd';
import dayjs from 'dayjs';

const FormsTable = ({ form, onSelectRow }) => {
  console.log(form)
  const columns = [
    {
      title: 'Template Title',
      dataIndex: ['template', 'title'],
      sorter: (a, b) => a.template.title.localeCompare(b.template.title),
      render: (_, record) => (
        <strong>{record.template.title}</strong>
      ),
    },
    {
      title: 'Topic',
      dataIndex: ['template', 'topic'],
      render: (topic, record) => record.template.topic?.name || '-',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      sorter: (a, b) => a.version - b.version,
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      sorter: (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt),
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={form}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => {onSelectRow?.(record)},
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default FormsTable;
