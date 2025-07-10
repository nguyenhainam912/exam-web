import { FC, useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import { StepBackwardFilled, StepForwardFilled, ZoomInOutlined, ZoomOutOutlined, CloudDownloadOutlined } from '@ant-design/icons';
// import styled from 'styled-components';
import FileDownload from 'js-file-download';
import { Button, Card, Select, Space } from 'antd';
interface IProps {
  fileUrl: string;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// const PdfWraper = styled.div`
//   .pdf-view {
//     position: relative;
//     overflow: 'scroll';
//     width: 100
//   }
//   .btn-read {
//     position: absolute;
//     top: 50%;
//     cursor: pointer;
//   }
//   .btn-next {
//     right: 0;
//   }
//   .btn-prev {
//     left: 0;
//   }
//   .page-status {
//     display: flex;
//     justify-content: center;
//     font-weight: 600;
//     text-align: center;
//     margin: 24px
//   }
//   .select-page {
//     display: flex;
//   }
//   .line {
//     margin: 0 8px;
//     border-right: 1px solid #f0f0f0;
//   }
//   .page-pdf {
//     display: flex;
//     justify-content: center;
//     height: calc(100vh) !important;
//   }
//   .page-pdf > canvas {
//     max-width: 100%;
//     height: calc(100vh) !important;
//   }
//   .download {
//     button {
//       color: #013F96;
//       background: #ffffff;
//       border: 1px solid #013F96;
//       border-radius: 4px;
//       cursor: pointer;
//       &:hover {
//         color: #ffffff;
//         background: #013F96;
//       }
//     }
//   }
//   .select-form {
//     width: 50px
//   }
// `;

const ReadPDF: FC<IProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [arrNum, setArrNum] = useState([]);
  const [data, setData] = useState();
  const [loadingText, setLoadingText] = useState(
    'Đang tải tài liệu. Vui lòng chờ trong giây lát...',
  );
  const documentRef = useRef<HTMLDivElement | any>();
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
  useEffect(() => {
    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'blob', // Important
    })
    .then((response) => setData(response.data))
    .catch(() =>
      setLoadingText('Lỗi tải file. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết'),
    );
  }, [fileUrl]);
  const handleDownload = () => {
    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'arraybuffer', // Important
    })
      .then((response) => FileDownload(response.data, `Phu-luc-hop-dong.pdf`))
      .catch(() =>
        setLoadingText('Lỗi tải file. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết'),
      );
  };
  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
    setPageNumber(1);
    const newArr: any = [];
    for (let i = 0; i < numPages; i++) {
      newArr.push(i + 1);
    }
    setArrNum(newArr);
  };

  const changePage = (offset: any) => setPageNumber((prevPageNumber) => prevPageNumber + offset);
  const onChangeSelectPage = (text: any) => {
    setPageNumber(Number(text));
  };
  const previousPage = () => changePage(-1);

  const nextPage = () => changePage(1);
  return (
    <>
      <Space>
        <Button 
          disabled={pageNumber <= 1} 
          onClick={previousPage} 
          icon={<StepBackwardFilled/>}
          style={{border: 0}}
        />
        <div>
          Trang {pageNumber || (numPages ? 1 : '--')} / {numPages || '--'}
        </div>
        <Button 
          disabled={pageNumber >= numPages} 
          onClick={nextPage} 
          icon={<StepForwardFilled/>}
          style={{border: 0}}
        />
        <div className="text-white font-bold" style={{ marginRight: '6px' }}>
          Chọn trang:{' '}
        </div>
        <Select
          onChange={onChangeSelectPage}
          value={pageNumber}
          disabled={false}
          options={(arrNum &&
            arrNum.length) ?
            arrNum.map((item) => (
              {
                label: item,
                value: item
              }
            )) : []
          }
        />
        <Button disabled={false} onClick={() => handleDownload()} icon={<CloudDownloadOutlined />}/>
        <Button disabled={false} onClick={() => setZoom(zoom + 0.1)} icon={<ZoomInOutlined />} />
        <Button disabled={false} onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))} icon={<ZoomOutOutlined />} />
      </Space>
      <Card style={{height: `${window.innerHeight * 0.85}px`, overflow: 'scroll', marginTop: 10}}>
        <Document file={data} onLoadSuccess={onDocumentLoadSuccess}>
          <Page className={'page-pdf'} pageNumber={pageNumber} scale={zoom} />
        </Document>
      </Card>
    </>
  );
};

export default ReadPDF;
