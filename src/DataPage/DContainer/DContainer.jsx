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
import urunApi from '../../api/urun-api'
import gunlukApi from '../../api/gunluk-api'
import kategoriApi from '../../api/kategori-api';
import { add } from 'date-fns';

const Urunler = await urunApi.getUrunler();
const Gunlukler = await gunlukApi.getGunlukler();


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


const urungir = (await urunApi.getUrunler()).map((urun) => urun.isim);
const kategorigir = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);


function createData(id , urun_isim, tarih, hedeflenen, ulasilan, atilan) {
  return {id , urun_isim, tarih, hedeflenen, ulasilan, atilan };
}

const columns = [
  {
    width: 160,
    label: 'Ürünler',
    dataKey: 'urun_isim',
  },
  {
    width: 120,
    label: 'Tarih',
    dataKey: 'tarih',
    numeric: true,
  },
  {
    width: 120,
    label: 'Hedef',
    dataKey: 'hedeflenen',
    numeric: true,
  },
  {
    width: 120,
    label: 'Tamamlanan',
    dataKey: 'ulasilan',
    numeric: true,
  },
  {
    width: 120,
    label: 'Sevk Miktarı',
    dataKey: 'atilan',
    numeric: true,
  },
];

const rows = Array.from({ length: Gunlukler.length }, (_, index) => {
  const Selection = Gunlukler[index];
  return createData(index, Selection.urun_isim, Selection.tarih, Selection.hedeflenen, Selection.ulasilan, Selection.atilan);
});

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: '#28342b',
            color:'white',
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
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function DContainer() {

  const [ urunismi, setUrunismi ] = useState('');
  const [ kategoriadi, setKategoriadi ] = useState('');
  const [ hedef, setHedef ] = useState(0);
  const [ tamamlanan, setTamamlanan] = useState(0);
  const [ fire, setFire] = useState(0);
  const [ sevk, setSevk] = useState(0);
  // console.log(Gunlukler)
  console.log(kategorigir)
  console.log(hedef)
  console.log(tamamlanan)
  console.log(fire)
  console.log(sevk)

  const [value, setValue] = useState([
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
  ]);

   const [showInputPart,setShow]= useState(false);

   const show_input_part = () => {
    setShow(true);
   }
   const close_input_part = () => {
    setShow(false);
   }

   const animationDuration = 600;
   const [massage, setMassage] = useState(false);

   
   const handleClick = async () => {

//     await gunlukApi.addGunluk (urunismi, 
//   {
//     personel_sayisi: 0,
//     hedeflenen: hedef,
//     ulasilan: tamamlanan,
//     atilan: fire,

//     tarih: (() => {
//       const date = new Date();
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = String(date.getMonth() + 1).padStart(2, '0');
//       const year = date.getFullYear();
    
//       return `${day}.${month}.${year}`;
//     })(),
// })           <-------------- ÇALIŞMIYOR      GET http://93.190.8.248:2001/gunluk/ekle//0/85/40/20/18.12.2023 net::ERR_EMPTY_RESPONSE

     setMassage(true);
   };
 
   const handleClose = () => {
     setMassage(false);
   };

  return (
    
<div>
{/* INPUT TEXT_FİELDS*/}
  {showInputPart && <Card 
  className='input_card'
  color='success'
  orientation="horizontal"
  size="lg"
  variant='outlined'
  >

   <div>
      <div className='input_header'>             
          <CancelIcon  className="close_btn" onClick={close_input_part} />    
          <h4>VERİ GİRİŞİ</h4>
      </div>
          
{/* AUTOCOMPLETE*/}
    <div className="autocomplete">
          <Autocomplete className="autocomplete" 
              disablePortal
              options={kategorigir}
              renderInput={(params) => <TextField onChange = {(e) => setKategoriadi(e.target.value)} className='auto_cmplete' {...params} label="Ürün Katagorisi" />}
          />
          <Autocomplete className="autocomplete"
              disablePortal
              options={urungir}
              renderInput={(params) => <TextField onChange = {(e) => setUrunismi(e.target.value)} className='auto_cmplete' {...params} label="Ürünler" />}
          />
    </div>
  
    <div className='input_part'> 
    <TextField onChange={(e) => setHedef(e.target.value)} sx={{paddingRight:1.5}} label="Hedef Miktar" variant="filled" />
    <TextField onChange={(e) => setTamamlanan(e.target.value)} sx={{paddingRight:1.5}} label="Tamamlanan Miktar" variant="filled" />
    <TextField onChange={(e) => setFire(e.target.value)} sx={{paddingRight:1.5}} label="Fire Miktarı" variant="filled" />
    <TextField onChange={(e) => setSevk(e.target.value)} sx={{paddingRight:1}} label="Sevk Edilecek Miktar" variant="filled" />

      <Stack  className="field_btn">
      <Button  color="success" variant='contained' aria-label="add"  sx={{marginTop:1}} onClick={handleClick} endIcon={<LoupeIcon />} >
          KAYDET
      </Button>
      </Stack>

{/* ANİMATİON-MASSAGE */} 
      <Snackbar
      variant="soft"
      color="success"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
        Verileriniz Başarıyla Kaydedildi
      </Snackbar>

      <Stack  className="field_btn">
        <Button color="error" variant='contained' aria-label="add" sx={{marginTop:1}} endIcon={<DeleteForeverIcon/>}>
          SIFIRLA
        </Button>
      </Stack></div>   

</div>
  </Card> }

{/* DATE TİME PİCKER*/}
  <div> 
  <Card className="date_card"
  color='danger'
  orientation="horizontal"
  size="lg"
  variant='outlined'
  >
      <div className="date_picker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
                <DemoItem label="Filtrele" component="DateRangePicker">
                  <DateRangePicker
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
          <Button className='list_btn' color="error" variant='contained' aria-label="add" sx={{marginTop:1}}>LİSTELE</Button>
      </div>
      <img src="src/assets/img/genel.png" width={140}></img>
</Card></div>


      <div  className='add_table' >
      <Stack className="add" sx={{backgroundColor:'#28342b'}}></Stack>

    <Paper className="table">
      <TableVirtuoso
      // {...rows.sort((a, b) => a.calories - b.calories)}
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
{/* ADD-BUTTON*/}
    <Stack className='add_btn'>EKLE
    <Fab color="error" onClick={show_input_part} sx={{ width :35 , height:0}}>
        <AddIcon />
    </Fab>
    </Stack>
  </div>
  
</div>
  );
}