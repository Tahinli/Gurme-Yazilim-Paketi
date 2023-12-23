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
import { useState } from 'react';
import Card from '@mui/joy/Card';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Snackbar from '@mui/joy/Snackbar';
import { keyframes } from '@mui/system';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded';
import urunApi from '../../../api/urun-api'
import gunlukApi from '../../../api/gunluk-api'
import kategoriApi from '../../../api/kategori-api';
import { fi, ka } from 'date-fns/locale';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";


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
  today.setDate(today.getDate() + 1); // Bugünün tarihine bir gün ekler
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return today.toLocaleDateString('tr-TR', options);
}

function convertDate(date){
  return new Date(date.split('.').reverse().join('-'))
}

function createData(id , urun_isim, tarih, hedeflenen, ulasilan, atilan, personel_sayisi, sevk, stok) {
  return {id , urun_isim, tarih, hedeflenen, ulasilan, atilan, personel_sayisi, sevk, stok };
}

const columns = [
  
  {
    width: 160,
    label: 'Ürünler',
    dataKey: 'urun_isim',
  },
  {
    width: 120,
    label: 'Personel Sayısı',
    dataKey: 'personel_sayisi',
    numeric: true,
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
    label: 'Fire',
    dataKey: 'atilan',
    numeric: true,
  },
  {
    width: 120,
    label: 'Sevk Miktarı',
    dataKey: 'sevk',
    numeric: true,
  },
  {
    width: 120,
    label: 'Stok Miktarı',
    dataKey: 'stok',
    numeric: true,
  },
  {
    width: 120,
    label: 'İşlemler',
    dataKey: 'islem',
    numeric: false,
  }
];



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
            border:'0.1px solid black',
            backgroundColor: '#28342b',
            color:'white',
            fontSize: 17,
            paddingLeft:1,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}



export default function DContainer() {

  const [Gunlukler, setGunlukler] = useState([]);
  const [ urunadi, setUrunadi ] = useState('');
  const [ kategoriadi, setKategoriadi ] = useState(''); 
  const [ hedef, setHedef ] = useState(0); //hedeflenen
  const [ tamamlanan, setTamamlanan] = useState(0); //ulasilan
  const [ fire, setFire] = useState(0); //atilan
  const [ sevk, setSevk] = useState(0); 
  const [ stok, setStok] = useState(0); 
  const [ personel_sayisi, setPersonel_sayisi] = useState(0);
  const [ tarih, setTarih] = useState(''); //tarih
  const [kategorigir, setKategorigir] = useState([]);
  const [urungir, setUrungir] = useState([]);
  const [Urunler, setUrunler] = useState([]);

  const [ edithedef, editsetHedef ] = useState(0); //hedeflenen
  const [ edittamamlanan, editsetTamamlanan] = useState(0); //ulasilan
  const [ editfire, editsetFire] = useState(0); //atilan
  const [ editsevk, editsetSevk] = useState(0); 
  const [ editstok, editsetStok] = useState(0); 
  const [ editpersonel_sayisi, editsetPersonel_sayisi] = useState(0);
  const [ edittarih, editsetTarih] = useState(''); //tarih

  const [rows, setRows] = useState([]);

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
    


  const [open, setOpen] = useState(false);


  const [rowname, setRowname] = useState('');
  const [rowtarih, setRowtarih] = useState('');
  const [rowindex, setRowindex] = useState(null);

  const handleClickOpen = (row) => {

    setRowindex(rows.findIndex(r => r.id === row.id))
    setRowname(row.urun_isim);
    setRowtarih(row.tarih);

    console.log(row)
    editsetPersonel_sayisi(row.personel_sayisi);
    editsetHedef(row.hedeflenen);
    editsetTamamlanan(row.ulasilan);
    editsetFire(row.atilan);
    editsetStok(row.stok);
    editsetSevk(row.sevk);
    editsetTarih(row.tarih);
    
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  /// ilk rows'u oluşturmak için
useEffect(() => {
    setRows(Array.from({ length: Gunlukler.length }, (_, index) => {
        const Selection = Gunlukler[index];
        return createData(index, Selection.urun_isim,
            Selection.tarih, Selection.hedeflenen, 
            Selection.ulasilan, Selection.atilan,
            Selection.personel_sayisi, Selection.sevk, Selection.stok);
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
  /////////////////////////////////////////

  const [value, setValue] = useState([
    dayjs( convertDate( getTodayDate() ) ),
    dayjs( convertDate( getTodayDate() ) ),
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
    //vvvvvvvvvvvvvvvv   GUNLUK EKLEME   vvvvvvvvvvvvvvvvvvvvvvvvvvv
    //if ile bos olup olmadigini kontrol et
    if(!(urunadi === null || urunadi === undefined || urunadi === ''
        &&
        kategoriadi === null || kategoriadi === undefined || kategoriadi === '')
      )
    {
      try {
        await gunlukApi.addGunluk (`${urunadi}`,
        {
          personel_sayisi: personel_sayisi,
          hedeflenen: hedef,
          ulasilan: tamamlanan,
          atilan: fire,
          stok : stok,
          sevk : sevk,
      
          tarih: getTodayDate(),
        });
      //////////////////////////////////////////////////////////////////////
      // vvvvvvvvvvvv ROWSU DEGISTIREREK TABLOYU GUNCELLER vvvvvvvvvvvvvvvvvvv
          setRows([
            createData(rows.length, urunadi, getTodayDate() , hedef, tamamlanan, fire, personel_sayisi, sevk, stok),
            ...rows,
          ]);//id , urun_isim, tarih, hedeflenen, ulasilan, atilan, personel_sayisi, sevk, stok
      //////////////////////////////////////////////////////////////////////
          setMassage(true);
        } catch (error) {
          console.error("An error occurred:", error);
        }
   };
}

////////////////////////// GUNLUK SILME /////////////////////////////
const handleDelete = async (row) => {
  try {
    await gunlukApi.deleteGunluk(`${row.urun_isim}`, `${row.tarih}`);
    setRows(prevRows => prevRows.filter(r => r.id !== row.id));
  } catch (error) {
    console.error("An error occurred while deleting:", error);
  }
};
 /////////////////////////////////////////////////////////////////////

 ////////////////////////// GUNLUK DÜZENLEME /////////////////////////////
 const handleEdit = async () => {
  console.log('edit')
  console.log(rowname,rowtarih, (editpersonel_sayisi),(edithedef),(edittamamlanan),(editfire),(editstok),(editsevk),edittarih)
  try {
    await gunlukApi.updateGunluk(`${rowname}`, `${rowtarih}`, {
      yeni_urun : rowname,
      yeni_personel_sayisi: (editpersonel_sayisi),
      yeni_hedeflenen: (edithedef),
      yeni_ulasilan: (edittamamlanan),
      yeni_atilan: (editfire),
      yeni_stok : (editstok),
      yeni_sevk : (editsevk),
      yeni_tarih: rowtarih, 
    });

    // Güncellenmiş row'u oluştur

const updatedRow = {
    ...rows[rowindex],
  personel_sayisi: parseInt(editpersonel_sayisi),
    hedeflenen: parseInt(edithedef),
    ulasilan: parseInt(edittamamlanan),
    atilan: parseInt(editfire),
    stok: parseInt(editstok),
    sevk: parseInt(editsevk),
    tarih: rowtarih,
    };

    // Yeni bir rows dizisi oluştur ve güncellenmiş row'u içine ekle
    const updatedRows = [
    ...rows.slice(0, rowindex),
    updatedRow,
    ...rows.slice(rowindex + 1),
    ];
console.log(updatedRows);
    // Update the rows state
    setRows(updatedRows);

  } catch (error) {
    console.error("An error occurred while updating:", error);
  }
  finally{
    handleClickClose();
  }
};
 /////////////////////////////////////////////////////////////////////

   const handleClose = () => {
     setMassage(false);
   };

   function rowContent(_index, row) {
    return (
      <React.Fragment>  
        {columns.map((column) => (
          column.dataKey !== 'islem' ?
            <TableCell
                key={column.dataKey}
                align={column.numeric || false ? 'right' : 'left'}
                sx={{backgroundColor:'rgb(209, 209,209)'}}
              >
                {row[column.dataKey]}
              </TableCell>   
              : 
              <TableCell align="right" key={column.dataKey} sx={{backgroundColor:'rgb(209, 209,209)'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button                
                    onClick={() => handleDelete(row)}
                    size="small" // makes the button smaller
                    variant="contained" // gives the button an outline
                    color="error" 
                    endIcon={<DeleteForeverIcon/>}
                  >
                    Sil
                  </Button >
               
                  <Button
                    className='table_btn'
                    onClick={() => handleClickOpen(row)}
                    size='small'
                    color="success"
                    variant="contained"
                    aria-label="add"
                    endIcon={<BorderColorIcon />}
                  >
                    Düzenle
                  </Button>
                   <div>
                  <Dialog open={open} onClose={()=>handleClickClose()} maxWidth="xl" >
                    <DialogTitle sx={{backgroundColor:'rgb(72, 194, 102)'}}>DÜZENLE</DialogTitle>
                        <p style={{paddingLeft:20,marginBottom:0 ,color:'red',fontSize:17}}
                        >
                          (Tarihi 'gg.aa.yyyy' Şeklinde Giriniz.)
                        </p>
                    
                    <Card  
                     color='neutral'
                     orientation="horizontal"
                     size="lg"
                     variant='soft'
                     sx={{width:'100%'}}
                     > 
                        <TextField onChange={(e) => editsetPersonel_sayisi(e.target.value)} type="number" autoFocus margin="dense" label="Personel Sayısı" fullWidth defaultValue={editpersonel_sayisi} inputProps={{ min: 0 }}/>
                        <TextField onChange={(e) => editsetTarih(e.target.value)} margin="dense" label="Tarih" fullWidth defaultValue={edittarih}/>
                        <TextField onChange={(e) => editsetHedef(e.target.value)} type="number" autoFocus margin="dense" label="Hedef" fullWidth defaultValue={edithedef} inputProps={{ min: 0 }}/>
                        <TextField onChange={(e) => editsetTamamlanan(e.target.value)} type="number" margin="dense" label="Tamamlanan" fullWidth defaultValue={edittamamlanan} inputProps={{ min: 0 }}/>
                        <TextField onChange={(e) => editsetFire(e.target.value)} type="number" autoFocus margin="dense" label="Fire" fullWidth defaultValue={editfire} inputProps={{ min: 0 }}/>
                        <TextField onChange={(e) => editsetSevk(e.target.value)} type="number" margin="dense" label="Sevk" fullWidth defaultValue={editsevk} inputProps={{ min: 0 }}/>
                        <TextField onChange={(e) => editsetStok(e.target.value)} type="number" autoFocus margin="dense" label="Stok" fullWidth defaultValue={editstok} inputProps={{ min: 0 }}/>
                    </Card>

                        <DialogActions sx={{alignItems:'left'}}>
                        <Button variant="contained" color="error" onClick={() => handleClickClose()}>İptal</Button>
                        <Button variant="contained" color="success" onClick={()=> handleEdit()}>Güncelle</Button>
                        </DialogActions>               
                  </Dialog>
               </div>
              </div>
              </TableCell>    
        ))}       
      </React.Fragment>
    );
  }
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
<div className='input_part'>
<div className='auto_text_btn' >
      <div className='input_header'>             
          <CancelIcon  className="close_btn" onClick={()=> close_input_part()} />    
          <h4>VERİ GİRİŞİ</h4>
      </div>
          
{/* AUTOCOMPLETE*/}
    <div className="autocomplete">
          <Autocomplete onChange={(event, value) => {
          setKategoriadi(value);
          setUrunadi(null);
          }}
              className="autocomplete" 
              disablePortal
              options={kategorigir}
              renderInput={(params) => <TextField onFocus={async () => await updatekategorigir()} className='auto_cmplete' {...params} label="Ürün Kategorisi" />}
          />
          <Autocomplete onChange={(event, value) => setUrunadi(value)}
              className="autocomplete"
              disablePortal
              options={urungir}
              renderInput={(params) => <TextField onFocus={() => updateurungir()} className='auto_cmplete' {...params} label="Ürünler" />}
          />
    </div>
  
    <div> 

    <TextField type="number" defaultValue = {0} 
     onChange={(e) => setHedef(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Hedef Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" defaultValue = {0} 
     onChange={(e) => setTamamlanan(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Tamamlanan Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" defaultValue = {0}
     onChange={(e) => setFire(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Fire Miktarı" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" defaultValue = {0}
     onChange={(e) => setSevk(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Sevk Edilecek Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" defaultValue = {0}
     onChange={(e) => setStok(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Stok Miktarı" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" defaultValue = {0}
     onChange={(e) => setPersonel_sayisi(e.target.value)}
     sx={{paddingRight:1.5,paddingTop:1.5}} label="Personel Sayisi" variant="filled" inputProps={{ min: 0 }}/>

<div className='buttons_input'>
  <Stack  className="field_btn">
        <Button  color="success" variant='contained' aria-label="add" 
        sx={{marginTop:1}} onClick={() => handleClick()} endIcon={<LoupeIcon />}
        >
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
      </Stack>
</div>
    
      </div>   
    </div>
  </div>
</Card> 
}

{/* DATE TİME PİCKER*/}
  {/*<div> 
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
      <img src="src/assets/img/genel.png"/>
    </div>
      
</Card></div>*/}

          <div>
             <Card className="date_card"
                      color='danger'
                      orientation="horizontal"
                      size="lg"
                      variant='outlined'
             >
                <div className='div_div'>Filtrele:
                  <div className="date_picker">
                      <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                      />
                      <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                      />
                    </div>
                    <Button className='list_btn' color="error" variant='contained' aria-label="add" sx={{marginTop:1}}>LİSTELE</Button> 
                  </div>   
                    <img src="src/assets/img/genel.png"/>
                </Card>
            </div>

      <div  className='add_table' >
      <Stack className="add" sx={{backgroundColor:'#28342b'}}></Stack>

    <Paper className="table">
      <TableVirtuoso
      // {...rows.sort((a, b) => b.id - a.id)}  // <--- SIRALAMA
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
{/* ADD-BUTTON*/}
    <Stack className='add_btn'>EKLE
    <Fab color="error" onClick={() => show_input_part()} sx={{ width :35 , height:0}}>
        <AddIcon />
    </Fab>
    </Stack>
  </div>
  
</div>
  );
}