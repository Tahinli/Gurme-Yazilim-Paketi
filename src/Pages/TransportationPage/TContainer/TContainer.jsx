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
import { keyframes } from '@mui/system';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';

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

  /// ilk rows'u oluşturmak için
  useEffect(() => {
    setRows(Array.from({ length: Gunlukler.length }, (_, index) => {
        const Selection = Gunlukler[index];
        return createData(index, Selection.urun_isim,
            Selection.tarih, Selection.sevk);
    }));
  }, [Gunlukler]); // Gunlukler dizisi değiştiğinde useEffect hook'u çalışır
  
  /// rows'u tarihe göre sıralamak için
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
    <div>
      {/* INPUT TEXT_FİELDS1*/}
      {showInputPart && (
        <Card
          className="input_card22"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
        >
          <div className="input_header2">
            <CancelIcon className="close_btn2" onClick={close_input_part} />
            <h4 style={{ maxHeight: "70px" }}>SEVK ANALİZİ</h4>
            <br />
            <div className="pie_chart2">
              <PieAnimation />
            </div>
          </div>
        </Card>
      )}
      {/* INPUT TEXT_FİELDS*/}
      <div className="input_sevk2">
        <Card
          className="input_card2"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
        >
          <div>
            <div className="input_header2">
              <h4>SEVK İŞLEMLERİ</h4>
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

            <div className="input_part2">
              <TextField
                disabled='true'
                sx={{ paddingRight: 1.5 }}
                label="Günlük Toplam Sevk"
                variant="filled"
              />
              <TextField
                disabled='true'
                sx={{ paddingRight: 1.5 }}
                label="Haftalık Toplam Sevk"
                variant="filled"
              />
               <TextField
                disabled='true'
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

        <div>
          <Card
            className="date_card2"
            color="danger"
            orientation="horizontal"
            size="lg"
            variant="outlined"
          >
            <div className="date_picker2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  components={["DateRangePicker", "DateRangePicker"]}
                >
                  <DemoItem label="Filtrele" component="DateRangePicker">
                    <DateRangePicker
                      value={value}
                      onChange={(newValue) => setValue(newValue)}
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
              <Button
                className="list_btn2"
                color="error"
                variant="contained"
                aria-label="add"
                sx={{ marginTop: 1 }}
              >
                LİSTELE
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="add_table2">
        <Stack className="add1" sx={{ backgroundColor: "#28342b" }}></Stack>

        <Paper className="table2">
          <TableVirtuoso
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
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
