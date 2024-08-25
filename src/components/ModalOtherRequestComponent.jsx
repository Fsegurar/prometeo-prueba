import { useState } from "react";
import { Modal, Button, message, Input } from "antd";
import PropTypes from "prop-types";
import { AiFillFilePdf } from "react-icons/ai";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import "./UploadDocumentComponent.css";

const ModalOtherRequestComponent = ({ visible, onClose, setDocuments }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filesArr, setFilesArr] = useState([
    { id: "file0", pdf: null, fileName: "Archivo no seleccionado" }
  ]);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      const documentsWithNames = filesArr
        .filter((file) => file.pdf)
        .map((file) => ({ url: file.pdf, name: file.fileName }));

      setDocuments(documentsWithNames);
      onClose();
      setConfirmLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    document.querySelector(".center-modal").classList.add("animate__zoomOut");
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const handleFileChange = (id, event) => {
    const { files } = event.target;
    if (files && files[0]) {
      const file = files[0];

      if (file.size > 10 * 1024 * 1024) {
        message.error(`${file.name}: El archivo no debe pesar más de 10MB`, 10);
        return;
      }
      if (!file.type.includes("pdf")) {
        message.error(`Por favor, seleccione un archivo PDF`, 3);
        return;
      }

      setFilesArr((prevFilesArr) =>
        prevFilesArr.map((fileObj) =>
          fileObj.id === id
            ? { ...fileObj, fileName: file.name, pdf: URL.createObjectURL(file) }
            : fileObj
        )
      );
    }
  };

  const handleDelete = (id) => {
    setFilesArr((prevFilesArr) =>
      prevFilesArr.map((fileObj) =>
        fileObj.id === id
          ? { ...fileObj, fileName: "Archivo no seleccionado", pdf: null }
          : fileObj
      )
    );
  };

  const handlePlusButton = () => {
    if (filesArr.length < 5) {
      const newId = `file${filesArr.length}`;
      setFilesArr((prevFilesArr) => [
        ...prevFilesArr,
        { id: newId, pdf: null, fileName: "Archivo no seleccionado" }
      ]);
    } else {
      message.warning("Solo se pueden agregar hasta 5 archivos.");
    }
  };

  const handleMinusButton = () => {
    if (filesArr.length > 1) {
      setFilesArr((prevFilesArr) => prevFilesArr.slice(0, -1));
    }
  };

  // Check if the first file in the array has a PDF loaded
  const isFirstFileLoaded = filesArr[0].pdf;

  return (
    <>
      {visible && (
        <div className="modal-backdrop">
          <Modal
            open={visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            footer={null}
            closable={false}
            centered
            wrapClassName="center-modal animate__animated animate__zoomIn"
          >
            <div className="text-center mb-4">
              <h4 className="text-lg font-bold">Documento - Formato .pdf*</h4>
            </div>
            <div className="grid">
              {filesArr.map((fileObj) => (
                <div key={fileObj.id} className="text-center">
                  <div>
                    <p className="text-sm font-bold mb-1">Documento</p>
                    <p className="text-xs text-gray-600 mb-4"></p>
                  </div>
                  <div
                    className="flex justify-center items-center border-dashed border-2 cursor-pointer rounded-md form-color h-20"
                    onClick={() => document.getElementById(fileObj.id).click()}
                  >
                    <Input
                      id={fileObj.id}
                      type="file"
                      accept=".pdf"
                      className="input-field"
                      hidden
                      onChange={(event) => handleFileChange(fileObj.id, event)}
                    />
                    {fileObj.pdf ? (
                      <div className="flex items-center">
                        <AiFillFilePdf color="#000" size={48} />
                        <p>{fileObj.fileName.length > 20 ? `${fileObj.fileName.slice(0, 17)}...${fileObj.fileName.split('.').pop()}` : fileObj.fileName}</p>
                      </div>
                    ) : (
                      <MdCloudUpload color="#000" size={50} />
                    )}
                  </div>
                  <span className="flex items-center uploaded-row">
                    {fileObj.fileName === "Archivo no seleccionado" ? (
                      "Archivo no seleccionado"
                    ) : (
                      <>
                        Eliminar archivo -
                        <MdDelete className="delete-icon" onClick={() => handleDelete(fileObj.id)} />
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              {filesArr.some((file) => file.pdf) ? (
                <Button onClick={handleOk} className="text-white mx-auto custom-btn">
                  Cargar documentos
                </Button>
              ) : (
                <Button disabled className="text-white mx-auto custom-btn">
                  Cargar documentos
                </Button>
              )}
              {isFirstFileLoaded && (
                <Button 
                  onClick={handlePlusButton} 
                  className="text-white mx-auto custom-btn" 
                  disabled={filesArr.length >= 5}
                >
                  Añadir otro
                </Button>
              )}
              {filesArr.length > 1 && (
                <Button onClick={handleMinusButton} className="text-white mx-auto custom-btn">
                  Eliminar último
                </Button>
              )}
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

ModalOtherRequestComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setDocuments: PropTypes.func.isRequired,
};

export default ModalOtherRequestComponent;
