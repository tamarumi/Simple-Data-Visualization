import { useState, useEffect } from "react";
import create from "zustand";import "antd/dist/reset.css";
import { ConfigProvider,  theme, Table, Modal, Input, Select} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import AddPerson from "./Components/Add";
import styled from "styled-components";

const StyledDiv = styled.div`
  background-color: #000;
`;

function App() {
  const [result, setResult] = useState<any>([]);
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingPerson, setEditingPerson] = useState<{
    id: string;
    name: string;
    address: { city: string; street: string };
    email: string;
  } | null>(null);

  interface Slice {
    data: any,
  }
  const useStore = create<Slice>((set) => ({
    data: [],
    setData: (result: any) => ({ data: result})
  }));

  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then((response) => response.json())
      .then((res) => setResult(res))
      .catch((err) => setError(err));
  }, []);

  useStore.setState({ data: result});
  const data = useStore((state: any) => state.data)

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: ({ city, street }: { city: string; street: string }) => (
        <div>{`${city}, ${street}`}</div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "5",
      render: (record: any) => {
        return (
          <>
            <DeleteOutlined
              onClick={() => {
                onDeletePerson(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const onDeletePerson = (record: any) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setResult((pre: any) => {
          return pre.filter((person: any) => person.id !== record.id);
        });
      },
    });
  };

  const onEditPerson = (record: any) => {
    setIsEditing(true);
    setEditingPerson({ ...record });
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingPerson(null);
  };

  const onChange = (value: string) => {
    setEditingPerson((pre: any) => {
      return { ...pre, gender: `${value}` };
      });
  };

  return (
    <>
    <StyledDiv>
     <ConfigProvider
     theme={{
      algorithm: theme.darkAlgorithm,
    }}
     >
     <AddPerson data={data} setResult={setResult} />
      <div
        style={{
          display: "block",
          width: 1200,
          padding: 10,
        }}
      />
      <Table dataSource={result} columns={columns} 
       onRow={(record) => {
        return {
            onDoubleClick: () => {
              onEditPerson(record);
            }
          }
        }
      }
      />
    </ConfigProvider>
      <Modal
        title="Edit Record"
        open={isEditing}
        okText="Save"
        onCancel={() => {
          resetEditing();
        }}
        onOk={() => {
          setResult((pre: any) => {
            return pre.map((person: any) => {
              if (person.id === editingPerson?.id) {
                return editingPerson;
              } else {
                return person;
              }
            });
          });
          resetEditing();
        }}
      >
        <Input
          value={editingPerson?.name}
          onChange={(e: any) => {
            setEditingPerson((pre: any) => {
              return { ...pre, name: e.target.value };
            });
          }}
        />
        <Input
          value={editingPerson?.email}
          onChange={(e: any) => {
            setEditingPerson((pre: any) => {
              return { ...pre, email: e.target.value };
            });
          }}
        />
        <Select
        showSearch
        placeholder="Select your gender"
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
        {
          value: 'female',
          label: 'female',
        },
        {
          value: 'male',
          label: 'male',
        },
        ]}
        />
        <Input
          value={editingPerson?.address.city}
          onChange={(e: any) => {
            setEditingPerson((pre: any) => {
              return {
                ...pre,
                address: {
                  ...editingPerson?.address,
                  city: e.target.value,
                },
              };
            });
          }}
        />
        <Input
          value={editingPerson?.address.street}
          onChange={(e: any) => {
            setEditingPerson((pre: any) => {
              return {
                ...pre,
                address: {
                  ...editingPerson?.address,
                  street: e.target.value,
                },
              };
            });
          }}
        />
      </Modal>
      </StyledDiv>
    </>
  );
}
export default App;


