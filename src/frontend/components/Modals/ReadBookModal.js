import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

function ReadBookModal({ open, setOpen, book }) {
  const values = [true, "sm-down", "md-down", "lg-down", "xl-down", "xxl-down"];
  const [fullscreen, setFullscreen] = useState(true);
  const [numPage, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setOpen(true);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageForward() {
    changePage(1);
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button key={idx} className="me-2 mb-2" onClick={() => handleShow(v)}>
          Full screen
          {typeof v === "string" && `below ${v.split("-")[0]}`}
        </Button>
      ))}
      <Modal show={open} fullscreen={fullscreen} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="book-modal-title">
              <div>
                <span className="darker">{book.name} </span>by{" "}
                <i>{book.authorName}</i>
              </div>
              <p>
                Page {pageNumber} of {numPage}
              </p>
              <div>
                {pageNumber > 1 && (
                  <Button
                    size="sm"
                    className="mr20"
                    variant="outline-dark"
                    onClick={changePageBack}
                  >
                    {" "}
                    Previous Page{" "}
                  </Button>
                )}
                {pageNumber < numPage && (
                  <Button
                    size="sm"
                    variant="outline-dark"
                    onClick={changePageForward}
                  >
                    {" "}
                    Next Page{" "}
                  </Button>
                )}
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="back-blush2">
          <div className="mrb20"></div>
          <div class="pdf-wrapper">
            <Document file={book.book} onLoadSuccess={onDocumentLoadSuccess}>
              <Page height="1300" pageNumber={pageNumber}></Page>
            </Document>
          </div>
          <div className="mrb20"></div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ReadBookModal;
