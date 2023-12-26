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
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { useState } from "react";
import Card from "@mui/joy/Card";
import Snackbar from "@mui/joy/Snackbar";
import { fontSize, height, keyframes, style } from "@mui/system";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import { PieAnimation } from "./stockpiechart";
import { useEffect } from "react";
import kategoriApi from "../../../api/kategori-api";
import gunlukApi from "../../../api/gunluk-api";
import urunApi from "../../../api/urun-api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DeleteForeverIcon from '@mui/icons-material/DeleteForeverTwoTone';
import InputAdornment from '@mui/material/InputAdornment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { set } from "date-fns";

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
  const [stoktansevk, setStoktansevk] = useState(0);
  const [stoktansilinen, setStoktansilinen] = useState(0);
  const [refresh, setRefresh] = useState(false);

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
    SevkEt();
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

useEffect(() => {
  console.log(Gunlukler);
}, [Gunlukler]);
  

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

  async function toplamstokhesapla() {  ////DATE RANGE E GORE HESAPLAMA EKLENMELİ
    console.log('toplamstokhesapla'+urunadi)
    try {
      //eğer bugüne ait bir log varsa onu tekrar düzenlemesi için değerleri getirir
      const presentgunluk = Gunlukler.find(gunluk => gunluk.urun_isim === urunadi
        &&gunluk.tarih===dayjs().format('DD.MM.YYYY'));
      if(presentgunluk){
          setStoktansevk(presentgunluk.stoktan_sevke);
          setStoktansilinen(presentgunluk.stoktan_silinen);
        }
        //bütün logları bulup matematik işlemleri ile toplam stok hesaplar
      const matchedGunlukler = Gunlukler.filter(gunluk => gunluk.urun_isim === urunadi);
      const totalStock = matchedGunlukler.reduce((total, gunluk) => total + gunluk.stok - (gunluk.stoktan_sevke + gunluk.stoktan_silinen), 0);
      setToplamstok(totalStock);

    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async function SevkEt() {
    try {
      const matchedGunluk = Gunlukler.find(gunluk => gunluk.urun_isim === urunadi
        &&gunluk.tarih===dayjs().format('DD.MM.YYYY'));
      if(matchedGunluk){         
          if( ((stoktansevk - matchedGunluk.stoktan_sevke) + 
          (stoktansilinen - matchedGunluk.stoktan_silinen))
           > toplamstok) {
              alert('Sevk edilecek miktar toplam stoktan fazla olamaz');
              return;
          }
        //bugüne ait bir log varsa onu editle
        console.log(matchedGunluk)
        await gunlukApi.updateGunluk(`${matchedGunluk.urun_isim}`, `${matchedGunluk.tarih}`, {
          yeni_urun: matchedGunluk.urun_isim,
          yeni_personel_sayisi: matchedGunluk.personel_sayisi,
          yeni_hedeflenen: matchedGunluk.hedeflenen,
          yeni_ulasilan: matchedGunluk.ulasilan,
          yeni_atilan: matchedGunluk.atilan,
          yeni_stok: matchedGunluk.stok,
          yeni_sevk: matchedGunluk.sevk,
          yeni_stoktan_sevke: stoktansevk,
          yeni_stoktan_silinen: stoktansilinen,
          yeni_tarih: matchedGunluk.tarih,
      });          
      }
      else{
        if(stoktansevk + stoktansilinen > toplamstok) {
          alert('Sevk edilecek miktar toplam stoktan fazla olamaz');
          return;
        }
        //bugüne ait bir log yoksa yeni bir log oluştur
        await gunlukApi.addGunluk(`${urunadi}`,
        {
          personel_sayisi: 0,
          hedeflenen: 0,
          ulasilan: 0,
          atilan: 0,
          stok: 0,
          sevk: 0,
          stokta_sevke: stoktansevk,
          stoktan_silinen: stoktansilinen,
          tarih: getTodayDate(),
        });
      }
      await updateGunlukler();
      setMassage(true);
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
    finally{
      setRefresh(!refresh)//TAM OLARAK ISTEDIGIMI YAPAMADIM DEGERLERI GUNCELLEMESI GEREKIYOR AMA ASENKRONDAN OLMUYOR
    } //BAŞARDIM
}

useEffect(() => {
  toplamstokhesapla();
}, [refresh]);


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
}, [urunadi]);

useEffect(() => {
  console.log(toplamstok);
}, [toplamstok]);

const [showThrowPart,setThrowPart]= useState(false);

    const show_ThrowPart= () => {
     setThrowPart(!showThrowPart);
    }

  return (
    <div className="Stok_containerbody">
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
      <div className="input_sevk1">
        <Card
          className="input_card1"
          color="success"
          orientation="horizontal"
          size="lg"
          variant="outlined"
          sx={{marginTop:6}}
        >
          <div>
            <div className="input_header12">
              <h4>STOK İŞLEMLERİ</h4>
            </div>

            {/* AUTOCOMPLETE*/}
            <div className="autocomplete1">
              <Autocomplete
                onChange={(event, value) => {
                setKategoriadi(value);
                setUrunadi('');
                }}
                className="autocomplete1"
                disablePortal
                options={kategorigir}
                isOptionEqualToValue={(option, value) => option === value || value === ''}
                renderInput={(params) => (
                  <TextField onFocus={async () => await updatekategorigir()}
                    className="auto_cmplete1"
                    {...params}
                    label="Ürün Kategorisi"
                  />
                )}
              />
              <Autocomplete
                onChange={async (event, value) => {
                    setUrunadi(value);
                    setStoktansevk(0);
                    setStoktansilinen(0);       
                }}
                className="autocomplete1"
                disablePortal
                options={urungir}
                isOptionEqualToValue={(option, value) => option === value || value === ''}
                renderInput={(params) => (
                  <TextField onFocus={() => {
                    updateurungir()
                  }}
                    value={urunadi}
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
                disabled={true}
                sx={{ paddingRight: 1.5 }}
                label="Toplam Stok"
                variant="filled"
              />
              <TextField
                onChange={(e) => setStoktansevk(e.target.value)}
                type="number"
                inputProps={{ min: 0 }}
                sx={{ paddingRight: 1.5 }}
                value = {stoktansevk}
                label="Sevk Edilecek Miktar"
                disabled={toplamstok <= 0}
                variant="filled"
              />
              <Stack className="field_btn1">
                <Button
                  color="success"
                  variant="contained"
                  aria-label="add"
                  sx={{ marginTop: 1 }}
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
      
            <div style={{display:'flex', flexDirection:'column',marginTop:-30}} className="throw_partdiv"> 
            {showThrowPart || false ?  <KeyboardArrowUpIcon color="error"  onClick={show_ThrowPart} style={{backgroundColor:'rgb(231, 201, 201)'}}/> : < KeyboardArrowDownIcon color="error" onClick={show_ThrowPart} style={{backgroundColor:'rgb(231, 201, 201)'}}/> }
            
            {showThrowPart && <div className="throw_part">
            <TextField
                onChange={(e) => setStoktansilinen(e.target.value)}
                sx={{ paddingRight: 0.5}}
                label="Stoktan Atılacak Miktar"
                variant="filled"
                type="number"
                value = {stoktansilinen}
                disabled={toplamstok <= 0}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DeleteForeverIcon
                        color="error"
                        variant="contained"
                        aria-label="add"
                      />
                    </InputAdornment>
                  ), }}
              />
              </div>}
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
                      sx={{marginTop:6}}
             >
                <div className='div_div1'>
                <EditCalendarIcon size='small'/>
                  Filtrele:
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
