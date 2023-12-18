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


const sample = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
];
const sample2 = [
  ['Frozen yoghurt'],
  ['Ice cream sandwich'],
  ['Eclair'],
  ['Cupcake'],
  ['Gingerbread'],
];

function createData(id, dessert, calories, fat, carbs, protein) {
  return { id, dessert, calories, fat, carbs, protein };
}

const columns = [
  {
    width: 160,
    label: 'Ürünler',
    dataKey: 'dessert',
  },
  {
    width: 120,
    label: 'Tarih',
    dataKey: 'calories',
    numeric: true,
  },
  {
    width: 120,
    label: 'Hedef',
    dataKey: 'fat',
    numeric: true,
  },
  {
    width: 120,
    label: 'Tamamlanan',
    dataKey: 'carbs',
    numeric: true,
  },
  {
    width: 120,
    label: 'Sevk Miktarı',
    dataKey: 'protein',
    numeric: true,
  },
];

const rows = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
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

   const handleClick = () => {
     setMassage(true);
   };
 
   const handleClose = () => {
     setMassage(false);
   };

  return (
    
<div className='body'>
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
              options={sample2}
              renderInput={(params) => <TextField className='auto_cmplete' {...params} label="Ürün Katagorisi" />}
          />
          <Autocomplete className="autocomplete"
              disablePortal
              options={sample2}
              renderInput={(params) => <TextField className='auto_cmplete' {...params} label="Ürünler" />}
          />
    </div>
  
    <div className='input_part'> 
    <TextField sx={{paddingRight:1.5 ,paddingTop:1.5}} label="Hedef Miktar" variant="filled" />
    <TextField sx={{paddingRight:1.5 ,paddingTop:1.5}} label="Tamamlanan Miktar" variant="filled" />
    <TextField sx={{paddingRight:1.5 ,paddingTop:1.5}} label="Fire Miktarı" variant="filled" />
    <TextField sx={{paddingRight:1.5 ,paddingTop:1.5}} label="Sevk Edilecek Miktar" variant="filled" />

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
    <div className='div_div'>
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
      <img src="src/assets/img/genel.png"></img>
    </div>
      
</Card></div>


      <div  className='add_table' >
      <Stack className="add" sx={{backgroundColor:'#28342b'}}></Stack>

    <Paper className="table">
      <TableVirtuoso 
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