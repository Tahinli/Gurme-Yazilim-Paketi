import { TableVirtuoso } from 'react-virtuoso';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoupeIcon from '@mui/icons-material/Loupe';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { useState } from 'react';
import Card from '@mui/joy/Card';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Snackbar from '@mui/joy/Snackbar';
import { fontSize, keyframes } from '@mui/system';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { PieAnimation } from "./stockpiechart2";
import { useEffect } from 'react';
import kategoriApi from '../../../api/kategori-api';
import urunApi from '../../../api/urun-api';
import gunlukApi from '../../../api/gunluk-api';

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
function getTodayDate() {
  const today = new Date();
  // today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return today.toLocaleDateString('tr-TR', options);
}

function convertDate(date){
  return new Date(date.split('.').reverse().join('-'))
}

function createData(id, urun_isim, tarih, sevk) {
  return { id, urun_isim, tarih, sevk };
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
    label: "Sevk",
    dataKey: "sevk",
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

export default function Tontainer() {

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

  /// ilk rows'u oluşturmak için
  useEffect(() => {
    setRows(Array.from({ length: Gunlukler.length }, (_, index) => {
        const Selection = Gunlukler[index];
        return createData(index, Selection.urun_isim,
            Selection.tarih, Selection.sevk);
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

  // useEffect(() => {
  //   console.log('urunadi: ', urunadi);
  // },[urunadi]);

  // useEffect(() => {
  //   console.log('kategoriadi: ', kategoriadi);
  // },[kategoriadi]);

  return (
    <div className='Transportation_containerbody'>
      {/* INPUT TEXT_FİELDS1*/}
      {showInputPart && (
        
        <div>
            <CancelIcon className="close_btn1" onClick={close_input_part} />
              <div>
                <PieAnimation />
              </div>
        </div>
    )}


      {/* INPUT TEXT_FİELDS*/}
      <div className="input_sevk2">
        <Card
          className="input_card2"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
          sx={{marginTop:6}}
        >
          <div>
            <div className="input_header12">
              <h4>SEVK İŞLEMLERİ</h4>
            </div>

            {/* AUTOCOMPLETE*/}
            <div className="autocomplete2">
              <Autocomplete
                onChange={(event, value) => {
                setKategoriadi(value);
                }}
                className="autocomplete2"
                disablePortal
                options={kategorigir}
                renderInput={(params) => (
                  <TextField onFocus={async () => await updatekategorigir()}
                    className="auto_cmplete2"
                    {...params}
                    label="Ürün Kategorisi"
                  />
                )}
              />
              <Autocomplete
                onChange={async (event, value) => {
                  setUrunadi(value);
                }}
                className="autocomplete2"
                disablePortal
                options={urungir}
                renderInput={(params) => (
                  <TextField onFocus={() => updateurungir()}
                    className="auto_cmplete2"
                    {...params}
                    label="Ürünler"
                  />
                )}
              />
            </div>

            <div className="input_part2">
              <TextField
                disabled={true}
                sx={{ paddingRight: 1.5 }}
                label="Günlük Toplam Sevk"
                variant="filled"
              />
              <TextField
                disabled={true}
                sx={{ paddingRight: 1.5 }}
                label="Haftalık Toplam Sevk"
                variant="filled"
              />
               <TextField
                disabled={true}
                sx={{ paddingRight: 1.5 }}
                label="Aylık Toplam Sevk"
                variant="filled"
                
              />

              

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
                
              </Snackbar>
            </div>
          </div>
        </Card>

              
{/* DATE TİME PİCKER*/}
<div>
             <Card className="date_card2"
                      color='danger'
                      orientation="horizontal"
                      size="lg"
                      variant='outlined'
                      sx={{marginTop:6}}
             >
                <div className='div_div2'>
                <EditCalendarIcon size='small'/>
                  Filtrele:
                        
                  <div className="date_picker2">
                    
                      <DatePicker className="date_3"
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="dd.MM.yyyy"
                          sx={{zIndex:1000}}
                      />
                      <DatePicker className="date_4"
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          dateFormat="dd.MM.yyyy"
                          sx={{zIndex:1000}}
                      />
                       
                    </div>
                  </div>   
                </Card>
            </div>
      </div>

      <div className="add_table2">
        <Stack className="add2" sx={{ backgroundColor: "#28342b" }}></Stack>

        <Paper className="table2">
          <TableVirtuoso
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            sx={{ zIndex: 0 }}
          />
        </Paper>
        {/* ADD-BUTTON*/}
        <Stack className="add_btn2">
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
