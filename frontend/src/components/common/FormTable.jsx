import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const FormsTable = ({ forms }) => {
  const navigate = useNavigate();

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
      title: 'Answers',
      dataIndex: ['_count', 'answers'],
      sorter: (a, b) => a._count.answers - b._count.answers,
    },
    {
      title: 'Checkbox Options',
      dataIndex: ['_count', 'answerOptions'],
      sorter: (a, b) => a._count.answerOptions - b._count.answerOptions,
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
      dataSource={forms}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => navigate(`/teamplete-fill/${record.id}`, {state:{mode:'updating', answers:record.answers, templateData: record}}), 
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default FormsTable;
