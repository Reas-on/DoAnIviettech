import React, { useRef } from 'react';
import { Table, Button } from 'antd';
import ClipboardJS from 'clipboard';

const InfoTable = () => {
  const dataSource = [
    {
      key: '1',
      category: 'Signup Test',
      info: 'mjssdn90@gmail.com',
    },
    {
      key: '2',
      category: 'Card MoMo Test',
      info: '9704 0000 0000 0018',
    },
    {
      key: '3',
      category: 'Card ZaloPay Test',
      info: 'Info',
    },
  ];

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Info',
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => copyTextToClipboard(record.info)}
        >
          Copy
        </Button>
      ),
    },
  ];

  const copyTextToClipboard = (text) => {
    const clipboard = new ClipboardJS('.ant-btn', {
      text: function() {
        return text;
      },
    });

    clipboard.on('success', function(e) {
      console.log('Copied:', e.text);
      clipboard.destroy();
    });

    clipboard.on('error', function(e) {
      console.error('Copy failed:', e.action);
      clipboard.destroy();
    });
  };

  return (
    <Table dataSource={dataSource} columns={columns} pagination={false} />
  );
};

export default InfoTable;
