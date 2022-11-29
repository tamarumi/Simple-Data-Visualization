import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
  Form,
  FormGroup,
} from "reactstrap";
import styled from "styled-components";
import { Chart } from "react-google-charts";
import { isWhiteSpaceLike } from "typescript";

const StyledButton = styled.button`
  background-color: rgb(255, 42, 51);
  font-size: 25px;
  color: white;
  padding: 0.25em 1em;
  border: none;
  border-radius: 5px;
  margin: 2rem 0 1rem 75rem;
`;

function AddPerson(props) {
  const zustandData = props.data;

  const initialProfile = {
    id: props.data.length + 1,
    name: "",
    email: "",
    gender: "",
    address: {},
    phone: "",
  };

  const set = props.setResult;
  const [modal, setModal] = useState(false);
  const [fields, setFields] = useState(initialProfile);
  const toggle = () => setModal(!modal);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields(() => {
      return {
        ...fields,
        [name]: value,
      };
    });
  };

  const onAddStudent = async () => {
    setModal(!modal);
    fields.id = props.data.length + 1;
    await set(() => {
      return [...props.data, fields];
    });
  };

  const options = {
    title: "People percentage in each city",
    is3D: true,
    backgroundColor: "#000",
    titleTextStyle: {
      color: "#FFFFFF",
      fontSize: 16,
      position: "right",
    },
    tooltip: {
      textStyle: { color: "#000" },
      showColorCode: true,
    },
    chartArea: { left: 60, top: 20, width: "100%", height: "95%" },
    legend: {
      alignment: "center",
      top: "25",
      position: "right",
      textStyle: { color: "#FFFFFF", fontSize: 16 },
    },
  };

  const cities = zustandData.map((c) => {
    return c.address.city;
  });
  
  const filtered = cities.filter(other => {
    return (
      other !== 'Chicago' && 
      other !== 'New York' && 
      other !== 'San Diego' && 
      other !== 'Los Angeles' 
    )
  });

  const reachable = cities.map((str) => {
    return str?.toString().replace(/\s/g, "");
  });
  const occurrences = reachable.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, []);

  const chartData = [
    ["People", "percent in each city"],
    ["Chicago", occurrences.Chicago],
    ["New York", occurrences.NewYork],
    ["Los Angeles", occurrences.LosAngeles],
    ["San Diego", occurrences.SanDiego],
    ["Other", filtered.length]
  ];

  return (
    <div>
      <br></br>
      <br></br>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={options}
        width={"100%"}
        height={"300px"}
      />
      <StyledButton color="danger" onClick={toggle}>
        Add Person
      </StyledButton>
      <Modal isOpen={modal} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>Add Personal Information</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="Email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter Email"
                type="email"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="gender">Gender</Label>
              <Input
                id="gender"
                name="gender"
                type="select"
                onChange={handleChange}
              >
                <option>female</option>
                <option>male</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="Address">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter city"
                type="text"
                onChange={(e) =>
                  setFields({
                    ...fields,
                    address: {
                      ...fields.address,
                      city: e.target.value,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="street">Street</Label>
              <Input
                id="street"
                name="street"
                placeholder="Enter street"
                type="text"
                onChange={(e) =>
                  setFields({
                    ...fields,
                    address: {
                      ...fields.address,
                      street: e.target.value,
                    },
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="Phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onAddStudent}>
            Save
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AddPerson;

