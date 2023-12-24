import { TableVirtuoso } from "react-virtuoso";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LoupeIcon from "@mui/icons-material/Loupe";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { useState } from "react";
import Card from "@mui/joy/Card";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Snackbar from "@mui/joy/Snackbar";
import { fontSize, keyframes } from "@mui/system";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import { PieAnimation } from "./stockpiechart";
import { useEffect } from "react";
import kategoriApi from "../../../api/kategori-api";
import gunlukApi from "../../../api/gunluk-api";
import urunApi from "../../../api/urun-api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const inAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const outAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

function createData(id, urun_isim, tarih, stok) {
  return { id, urun_isim, tarih, stok };
}

const columns = [
  {
    width: 20,
    label: "Ürünler",
    dataKey: "urun_isim",
  },
  {
    width: 20,
    label: "Tarih",
    dataKey: "tarih",
    numeric: false,
  },
  {
    width: 20,
    label: "Stok",
    dataKey: "stok",
  }
];

// const rows = Array.from({ length: 200 }, (_, index) => {
//   const randomSelection = sample[Math.floor(Math.random() * sample.length)];
//   return createData(index, ...randomSelection);
// });

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "#28342b",
            color: "white",
            fontSize: 17,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function SContainer() {


  const [Gunlukler, setGunlukler] = useState([]);
  const [ urunadi, setUrunadi ] = useState('');
  const [ kategoriadi, setKategoriadi ] = useState(''); 
  const [urungir, setUrungir] = useState([]);
  const [kategorigir, setKategorigir] = useState([]);
  const [rows, setRows] = useState([]);
  const [Urunler, setUrunler] = useState([]);
  const [toplamstok, setToplamstok] = useState(0);

  const [value, setValue] = useState([
    dayjs("2022-04-17"),
    dayjs("2022-04-21"),
  ]);

  const [showInputPart, setShow] = useState(false);

  const show_input_part = () => {
    setShow(true);
  };
  const close_input_part = () => {
    setShow(false);
  };

  const animationDuration = 600;
  const [massage, setMassage] = useState(false);

  const handleClick = () => {
    setMassage(true);
  };

  const handleClose = () => {
    setMassage(false);
  };

  async function updateGunlukler() {
    try {
      const newGunlukler = await gunlukApi.getGunlukler();
      setGunlukler(newGunlukler);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        await updateGunlukler();
    };

    fetchData();
}, []);

  async function updateUrunler() {
    try {
      const newUrunler = await urunApi.getUrunler(); 
      setUrunler(newUrunler);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  useEffect(() => {
    updateUrunler();
  }, [kategoriadi]);

  async function updatekategorigir() {
    console.log('updatekategorigir')
    try {
      const newKategorigir = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);
      setKategorigir(newKategorigir);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  function updateurungir() {
    console.log('updateurungir')
    const newUrungir = [];
    for (let urun of Urunler) {
      if(urun.kategori_isim === kategoriadi)
        newUrungir.push(urun.isim);
    }
    setUrungir(newUrungir);
  }

  function toplamstokhesapla() {  ////DATE RANGE E GORE HESAPLAMA EKLENMELİ
    console.log('toplamstokhesapla'+urunadi)
    try {
      const matchedGunlukler = Gunlukler.filter(gunluk => gunluk.urun_isim === urunadi);
      console.log(matchedGunlukler)
      const totalStock = matchedGunlukler.reduce((total, gunluk) => total + gunluk.stok, 0);
      console.log(totalStock)
      setToplamstok(totalStock);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }



  /// ilk rows'u oluşturmak için
useEffect(() => {
  setRows(Array.from({ length: Gunlukler.length }, (_, index) => {
      const Selection = Gunlukler[index];
      return createData(index, Selection.urun_isim,
          Selection.tarih, Selection.stok);
  }));
}, [Gunlukler]); // Gunlukler dizisi değiştiğinde useEffect hook'u çalışır

/// rows'u tarihe göre sıralamak için
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());
useEffect(() => {
  const sortedRows = rows.sort((a, b) => {
    const dateA = new Date(a.tarih.split('.').reverse().join('-'));
    const dateB = new Date(b.tarih.split('.').reverse().join('-'));
    return dateB - dateA;
  });

  setRows(sortedRows);
}, [rows]);

useEffect(() => {
  toplamstokhesapla();
  console.log(urunadi);
}, [urunadi]);

useEffect(() => {
  console.log(toplamstok);
}, [toplamstok]);

  return (
    <div className="Stok_containerbody">
      {/* INPUT TEXT_FİELDS1*/}
      {showInputPart && (
        <Card
          className="input_card11"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
        >
          <div className="input_header1">
            <CancelIcon className="close_btn1" onClick={close_input_part} />
            <h4 className="stokislem_1 "style={{ maxHeight: "70px" }}>STOK ANALİZİ</h4>
            <br />
            <div className="pie_chart1">
              <PieAnimation />
            </div>
          </div>
        </Card>
      )}
      {/* INPUT TEXT_FİELDS*/}
      <div className="input_sevk1 ">
        <Card
          className="input_card1"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
        >
          <div>
            <div className="input_header1">
              <h4 className="stokislem_1">STOK İŞLEMLERİ</h4>
            </div>

            {/* AUTOCOMPLETE*/}
            <div className="autocomplete1">
              <Autocomplete
                onChange={(event, value) => {
                setKategoriadi(value);
                }}
                className="autocomplete1"
                disablePortal
                options={kategorigir}
                renderInput={(params) => (
                  <TextField onFocus={async () => await updatekategorigir()}
                    className="auto_cmplete1"
                    {...params}
                    label="Ürün Katagorisi"
                  />
                )}
              />
              <Autocomplete
                onChange={async (event, value) => {
                  setUrunadi(value);
                }}
                className="autocomplete1"
                disablePortal
                options={urungir}
                renderInput={(params) => (
                  <TextField onFocus={() => updateurungir()}
                    className="auto_cmplete1"
                    {...params}
                    label="Ürünler"
                  />
                )}
              />
            </div>

            <div className="input_part1">
              <TextField
                value={toplamstok}
                disabled='true'
                sx={{ paddingRight: 1.5 }}
                label="Toplam Stok"
                variant="filled"
              />
              <TextField
                sx={{ paddingRight: 1.5 }}
                label="Sevk Edilecek Miktar"
                variant="filled"
              />

              <Stack className="field_btn1">
                <Button
                  color="success"
                  variant="contained"
                  aria-label="add"
                  sx={{ marginTop: -1 }}
                  onClick={handleClick}
                  endIcon={<LoupeIcon />}
                >
                  SEVK
                </Button>
              </Stack>

              {/* ANİMATİON-MASSAGE */}
              <Snackbar
                variant="soft"
                color="success"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={massage}
                onClose={handleClose}
                autoHideDuration={1000}
                animationDuration={animationDuration}
                startDecorator={<PlaylistAddCheckCircleRoundedIcon />}
                sx={{
                  ...(open && {
                    animation: `${inAnimation} ${animationDuration}ms forwards`,
                  }),
                  ...(!open && {
                    animation: `${outAnimation} ${animationDuration}ms forwards`,
                  }),
                }}
              >
                Sevk İşlemi Başarıyla Gerçekleşti
              </Snackbar>
            </div>
          </div>
        </Card>

       
{/* DATE TİME PİCKER*/}
<div>
             <Card className="date_card1"
                      color='danger'
                      orientation="horizontal"
                      size="lg"
                      variant='outlined'
             >
                <div className='div_div1'>
                        
                  <div className="date_picker1">
                    
                      <DatePicker className="date_1"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="dd.MM.yyyy"
                          sx={{zIndex:1000}}
                      />
                      <DatePicker className="date_2"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          dateFormat="dd.MM.yyyy"
                          sx={{zIndex:1000}}
                      />
                       <Button
                className="list_btn1"
                color="error"
                variant="contained"
                aria-label="add"
                sx={{ marginTop: 9}}
              >
                LİSTELE
              </Button>
                    </div>
                  </div>   
                </Card>
            </div>
      </div>

      <div className="add_table1">
        <Stack className="add1" sx={{ backgroundColor: "#28342b" }}></Stack>

        <Paper className="table1">
          <TableVirtuoso
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            sx={{ zIndex: 0 }}
          />
        </Paper>
        {/* ADD-BUTTON*/}
        <Stack className="add_btn1">
          ANALİZ
          <Fab
            color="error"
            onClick={show_input_part}
            sx={{ width: 35, height: 0 }}
          >
            <AddIcon />
          </Fab>
        </Stack>
      </div>
    </div>
  );
}
