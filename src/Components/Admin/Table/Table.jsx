import "./Table.css";
import GetAppIcon from "@mui/icons-material/GetApp";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "react-query";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
// import FeedbackPopup from "../../Forms/Feedback/FeedbackPopup";
// import QueryPopup from "../../Forms/Query/QueryPopUp";
// import ResponsePopup from "../../Forms/Response/Response";
import Spinner from "../../Loaders/Spinner";

import { axiosMethod } from "../../Api/Post.js";
import axios from "axios";

// TODO: first after creating and updating form must be empty
// TODO:pagination
// TODO: export ko button xa tesma react-csv lib use garera export garne data as csv

const Tables = ({ content }) => {
  const { setError } = useForm();
  const [data, setData] = useState();
  const [formData, setFormData] = useState();
  const [showForm, setShowForm] = useState(false);
  const printRef = useRef();

  const methods = useForm();

  const token = localStorage.getItem("token");

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // userQuery to fetch the contents
  function useData() {
    return useQuery(
      `${content}`,
      async () => {
        return await axios.get(`/${content.toLowerCase()}/get`, {
          ///Dynamic fetch on content querys
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      {
        enabled: false,
        onSuccess: (res) => {
          setData(res?.data);
        },
        onError: (err) => {
          if (err.response?.data) {
            setError("SubmitError", {
              type: "custom",
              message: err.response?.data?.error,
            });
          }
        },
        retry: 0,
      }
    );
  }

  const { refetch, isLoading } = useData();

  const [labels, setLabels] = useState([]); //For table headings

  useEffect(() => {
    !showForm && setFormData();
  }, [showForm]);

  useEffect(() => {
    refetch();
    // Set the labels according to content
    if (content === "Product") setLabels(["Name", "Email", "Message"]);
    if (content === "User") setLabels(["Text", "Intent"]);
    if (content === "Response") setLabels(["Text", "Tag", "Link"]);
  }, [, content]);

  const deleteHandler = async (id) => {
    await axiosMethod({
      url: `/${content.toLowerCase()}/${id}`,
      method: "delete",
      purpose: "Deleted successfully",
    }).finally(() => refetch());
  };

  const editHandler = (data) => {
    setShowForm(true);
    setFormData(data);
  };

  const downloadCsvHandler = () => {};
  console.log(data);
  return isLoading ? (
    <div className="loading-spinner">
      <Spinner />
    </div>
  ) : (
    <div className="listContainer">
      <div className="listTitle">Latest {content}</div>
      <TableContainer component={Paper} className="table print" ref={printRef}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {labels.map((label) => (
                <TableCell
                  className="tableCell"
                  style={{ fontWeight: "bold", fontSize: "15px" }}
                >
                  {label}
                </TableCell>
              ))}{" "}
              {data && (
                <TableCell>
                  <GetAppIcon
                    fontSize="medium"
                    onClick={() => console.log("fd")}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data == null ? (
              <TableRow key="Name"></TableRow>
            ) : (
              data.map((row) => {
                if (content === "Product") {
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">
                        {row.person_name}
                      </TableCell>
                      <TableCell className="tableCell">{row.email}</TableCell>
                      <TableCell className="tableCell">{row.message}</TableCell>
                      <TableCell className="tableCell">
                        <EditIcon
                          className="icon"
                          type="submit"
                          onClick={() => editHandler(row)}
                        />
                        <DeleteIcon
                          className="icon"
                          type="submit"
                          onClick={() => deleteHandler(row?.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
                if (content === "User") {
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">{row.text}</TableCell>
                      <TableCell className="tableCell">{row.intent}</TableCell>
                      <TableCell className="tableCell">
                        <EditIcon
                          className="icon"
                          type="submit"
                          onClick={() => editHandler(row)}
                        />
                        <DeleteIcon
                          className="icon"
                          type="submit"
                          onClick={() => deleteHandler(row?.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
                if (content === "Response") {
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">{row.text}</TableCell>
                      <TableCell className="tableCell">{row.tag}</TableCell>
                      <TableCell className="tableCell">{row.Link}</TableCell>
                      <TableCell className="tableCell">
                        <EditIcon
                          className="icon"
                          type="submit"
                          onClick={() => editHandler(row)}
                        />
                        <DeleteIcon
                          className="icon"
                          type="submit"
                          onClick={() => deleteHandler(row?.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dynamic create button */}
      {content !== "Product" && (
        <div
          className="button-container"
          onClick={() => setShowForm((curr) => !showForm)}
        >
          <button>Create {content} </button>
        </div>
      )}
      {/* <FormProvider {...methods}>
        {showForm && content === "Product" ? (
          <FeedbackPopup setShowForm={setShowForm} data={formData} />
        ) : showForm && content === "User" ? (
          <QueryPopup
            setShowForm={setShowForm}
            data={formData}
            refetch={refetch}
          />
        ) : showForm && content === "Response" ? (
          <ResponsePopup
            setShowForm={setShowForm}
            data={formData}
            refetch={refetch}
          />
        ) : null}
      </FormProvider> */}
    </div>
  );
};

export default Tables;
