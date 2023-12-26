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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';


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
  today.setDate(today.getDate() -1); // Bugünün tarihine bir gün ekler
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return today.toLocaleDateString('tr-TR', options);
}

function convertDate(date) {
  return new Date(date.split('.').reverse().join('-'))
}

function createData(id, urun_isim, tarih, hedeflenen, ulasilan, atilan, personel_sayisi, sevk, stok) {
  return { id, urun_isim, tarih, hedeflenen, ulasilan, atilan, personel_sayisi, sevk, stok };
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
    width: 70,
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
            border: '0.1px solid black',
            backgroundColor: '#28342b',
            color: 'white',
            fontSize: 17,
            paddingLeft: 1,
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
  const [urunadi, setUrunadi] = useState('');
  const [kategoriadi, setKategoriadi] = useState('');
  const [hedef, setHedef] = useState(0); //hedeflenen
  const [tamamlanan, setTamamlanan] = useState(0); //ulasilan
  const [fire, setFire] = useState(0); //atilan
  const [sevk, setSevk] = useState(0);
  const [stok, setStok] = useState(0);
  const [personel_sayisi, setPersonel_sayisi] = useState(0);
  const [tarih, setTarih] = useState(''); //tarih
  const [kategorigir, setKategorigir] = useState([]);
  const [urungir, setUrungir] = useState([]);
  const [Urunler, setUrunler] = useState([]);

  const [edithedef, editsetHedef] = useState(0); //hedeflenen
  const [edittamamlanan, editsetTamamlanan] = useState(0); //ulasilan
  const [editfire, editsetFire] = useState(0); //atilan
  const [editsevk, editsetSevk] = useState(0);
  const [editstok, editsetStok] = useState(0);
  const [editpersonel_sayisi, editsetPersonel_sayisi] = useState(0);
  const [edittarih, editsetTarih] = useState(''); //tarih

  const [rows, setRows] = useState([]);

  const [startDate, setStartDate] = useState(convertDate(getTodayDate()));
  const [endDate, setEndDate] = useState(convertDate(getTodayDate()));



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
  }, [startDate, endDate]);

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
    try {
      const newKategorigir = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);
      setKategorigir(newKategorigir);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  function updateurungir() {
    const newUrungir = [];
    for (let urun of Urunler) {
      if (urun.kategori_isim === kategoriadi)
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


  function updateRows() {
    setRows(
      Gunlukler.map((Selection, index) => {
        if (
          new Date(convertDate(Selection.tarih)) >= startDate &&
          new Date(convertDate(Selection.tarih)) <= endDate 
          // &&
          // Selection.hedeflenen !== 0 &&
          // Selection.ulasilan !== 0
        ) {
          return createData(
            index,
            Selection.urun_isim,
            Selection.tarih,
            Selection.hedeflenen,
            Selection.ulasilan,
            Selection.atilan,
            Selection.personel_sayisi,
            Selection.sevk,
            Selection.stok
          );
        }
        return undefined;
      }).filter(item => item !== undefined)
    );
  } // undefined değerlerini kaldır
  /// ilk rows'u oluşturmak için
  useEffect(() => {
    updateRows();
  }, [Gunlukler, startDate, endDate, open]); // Gunlukler dizisi değiştiğinde useEffect hook'u çalışır

  const [value, setValue] = useState([
    dayjs(convertDate(getTodayDate())),
    dayjs(convertDate(getTodayDate())),
  ]);

  const [showInputPart, setShow] = useState(false);

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
    if (!(urunadi === null || urunadi === undefined || urunadi === ''
      &&
      kategoriadi === null || kategoriadi === undefined || kategoriadi === '')
    ) {
      try {
        await gunlukApi.addGunluk(`${urunadi}`,
          {
            personel_sayisi: personel_sayisi,
            hedeflenen: hedef,
            ulasilan: tamamlanan,
            atilan: fire,
            stok: stok,
            sevk: sevk,
            stokta_sevke:0,
            stoktan_silinen:0,
            tarih: getTodayDate(),
          });
        //////////////////////////////////////////////////////////////////////
        // vvvvvvvvvvvv ROWSU DEGISTIREREK TABLOYU GUNCELLER vvvvvvvvvvvvvvvvvvv
        setRows([
          createData(rows.length, urunadi, getTodayDate(), hedef, tamamlanan, fire, personel_sayisi, sevk, stok),
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
    console.log(rowname, rowtarih, (editpersonel_sayisi), (edithedef), (edittamamlanan), (editfire), (editstok), (editsevk), edittarih)
    const matchedGunluk = Gunlukler.find(gunluk => 
      gunluk.urun_isim === rowname && gunluk.tarih === rowtarih);
    let datePattern = /^\d{2}\.\d{2}\.\d{4}$/; // gg.aa.yyyy
    if (datePattern.test(edittarih)) {
      // if (editpersonel_sayisi < 0 || edithedef < 0 || edittamamlanan < 0 || editfire < 0 || editstok < 0 || editsevk < 0) {
      //   console.log(calisti)
      //   alert("Değerler 0 veya daha büyük olmalıdır.");
      //   return;
      // }
      try {
        await gunlukApi.updateGunluk(`${rowname}`, `${rowtarih}`, {
          yeni_urun: rowname,
          yeni_personel_sayisi: (editpersonel_sayisi),
          yeni_hedeflenen: (edithedef),
          yeni_ulasilan: (edittamamlanan),
          yeni_atilan: (editfire),
          yeni_stok: (editstok),
          yeni_sevk: (editsevk),
          yeni_stoktan_sevke: matchedGunluk.stoktan_sevke,
          yeni_stoktan_silinen: matchedGunluk.stoktan_silinen,
          yeni_tarih: edittarih,
      });
        await updateGunlukler();
        updateRows();
    } 
    catch (error) {
      console.error("An error occurred while updating:", error);
    }
      finally {
        handleClickClose();
      }
    }
      else{
        alert("Lütfen 'gg.aa.yyyy' formatında bir tarih girin.");
        return;
      } 
  };

  const handleClear = async () => {
    setHedef(0)
    setTamamlanan(0)
    setFire(0)
    setSevk(0)
    setStok(0)
    setPersonel_sayisi(0)
    setUrunadi('')
    setKategoriadi('')
  }
  /////////////////////////////////////////////////////////////////////

  const handleClose = () => {
    setMassage(false);
  };

  /// rows'u tarihe göre sıralamak için
  useEffect(() => {
    const sortedRows = [...rows].sort((a, b) => {
      const dateA = new Date(a.tarih.split('.').reverse().join('-'));
      const dateB = new Date(b.tarih.split('.').reverse().join('-'));
      return dateB - dateA;
    });
    if (JSON.stringify(rows) !== JSON.stringify(sortedRows)) {  //EGER AYNI ISE SIRALAMAZ BOYLECE SONSUZ DONGUDEN KURTARILIR
      setRows(sortedRows);
    }
  }, [rows]);
  /////////////////////////////////////////

  //PDF EXPORT
  

  // const fontBlob = await fetch('../../assets/fonts/arbutusslab-regular.ttf').then(response => response.blob());
  // const fontBase64 = await blobToDataURL(fontBlob);

  // doc.addFileToVFS("arbutusslab-regular.ttf", fontBase64.split(",")[1]);
  // doc.addFont("arbutusslab-regular.ttf", "MyFont", "normal");
  // doc.setFont("MyFont");
  const doc = new jsPDF()
  
  const exportTableToPDF = () => {

    const data = rows.map((row) => {
      return {
        urun_isim: row.urun_isim,
        tarih: row.tarih,
        hedeflenen: row.hedeflenen,
        ulasilan: row.ulasilan,
        atilan: row.atilan,
        personel_sayisi: row.personel_sayisi,
        sevk: row.sevk,
        stok: row.stok,
      }
    })
    const columns = [
      { header: 'Urun Adı', dataKey: 'urun_isim' },
      { header: 'Tarih', dataKey: 'tarih' },
      { header: 'Hedeflenen', dataKey: 'hedeflenen' },
      { header: 'Ulaşılan', dataKey: 'ulasilan' },
      { header: 'Fire', dataKey: 'atilan' },
      { header: 'Personel Sayısı', dataKey: 'personel_sayisi' },
      { header: 'Sevk', dataKey: 'sevk' },
      { header: 'Stok', dataKey: 'stok' },
    ]
    
    autoTable(doc, {
      columns,
      body: data,
      styles: { cellWidth: 'wrap' },
      margin: { top: 15, right: 10, bottom: 10, left: 10 },
      didDrawPage: (data) => {
        doc.setFontSize(10)
        doc.text(`${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10)

        let text = `${new Date().toLocaleString()}`
        let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor
        let textOffset = doc.internal.pageSize.width - textWidth - data.settings.margin.right

        doc.text(text, textOffset, 10)
      }
    })

    doc.save("Data-Report.pdf")
  };

  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          column.dataKey !== 'islem' ?
            <TableCell
              key={column.dataKey}
              align={column.numeric || false ? 'right' : 'left'}
              sx={{ backgroundColor: 'rgb(209, 209,209)' }}
            >
              {row && row[column.dataKey]} {/* row nesnesinin null veya undefined olup olmadığını kontrol edin */}
            </TableCell>
            :
            <TableCell align="right" key={column.dataKey} sx={{ backgroundColor: 'rgb(209, 209,209)' }}>
              <div className=' table_btns' style={{ display: 'flex' }}>
                <DeleteForeverIcon
                  onClick={() => handleDelete(row)}
                  color="error"
                  sx={{ fontSize: 30, marginRight: 2.5 }}
                />

                <BorderColorIcon
                  onClick={() => handleClickOpen(row)}
                  color="success"
                  sx={{ fontSize: 30 }}
                />

                <div>
                  <Dialog open={open} onClose={() => handleClickClose()} maxWidth="xl" className='edit_dialog' BackdropProps={{style: {backgroundColor: 'transparent'}}} sx={{paddingBottom:73}}>

                    <DialogTitle sx={{ backgroundColor: 'rgb(72, 194, 102)' }}>DÜZENLE</DialogTitle>
                    <p style={{ paddingLeft: 20, marginBottom: 0, color: 'red', fontSize: 17 }}
                    >
                      (Tarihi 'gg.aa.yyyy' Şeklinde Giriniz.)
                    </p>

                    <Card

                      className='edit_card'

                      color='neutral'
                      orientation="horizontal"
                      size="lg"
                      variant='soft'
                      sx={{ width: '100%' }}
                    >

                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val > 0)
                        editsetPersonel_sayisi(val);
                      }} 
                      type="number" autoFocus margin="dense" label="Personel Sayısı" fullWidth defaultValue={editpersonel_sayisi} inputProps={{ min: 0 }} />
                      <TextField onChange={(e) => {
                        editsetTarih(e.target.value);
                      }} 
                      margin="dense" label="Tarih" fullWidth defaultValue={edittarih} />
                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val > 0)
                        editsetHedef(e.target.value)
                      }}
                       type="number" autoFocus margin="dense" label="Hedef" fullWidth defaultValue={edithedef} inputProps={{ min: 0 }} />
                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val >= 0)
                        editsetTamamlanan(e.target.value)
                      }}
                       type="number" margin="dense" label="Tamamlanan" fullWidth defaultValue={edittamamlanan} inputProps={{ min: 0 }} />
                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val >= 0)
                        editsetFire(e.target.value)
                      }}
                      type="number" autoFocus margin="dense" label="Fire" fullWidth defaultValue={editfire} inputProps={{ min: 0 }} />
                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val >= 0)
                        editsetSevk(e.target.value)
                      }}
                      type="number" margin="dense" label="Sevk" fullWidth defaultValue={editsevk} inputProps={{ min: 0 }} />
                      <TextField onChange={(e) => {
                        let val = e.target.value;
                        if (val >= 0)
                        editsetStok(e.target.value)
                      }} 
                      type="number" autoFocus margin="dense" label="Stok" fullWidth defaultValue={editstok} inputProps={{ min: 0 }} />
                    </Card>

                    <DialogActions sx={{ alignItems: 'left' }}>
                      <Button variant="contained" color="error" onClick={() => handleClickClose()}>İptal</Button>
                      <Button variant="contained" color="success" onClick={() => handleEdit()}>Güncelle</Button>

                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            </TableCell>
        ))}
      </React.Fragment>
    );
  }
  return (

<div className='Data_containerbody'>
{/* INPUT PART*/}
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
          <Autocomplete value={kategoriadi} onChange={(event, value) => {
          setKategoriadi(value);
          setUrunadi('');
          }}
              className="autocomplete" 
              disablePortal
              options={kategorigir}
              isOptionEqualToValue={(option, value) => option === value || value === ''}
              renderInput={(params) => <TextField value={kategoriadi} onFocus={async () => await updatekategorigir()} className='auto_cmplete' {...params} label="Ürün Kategorisi" />}
          />
          <Autocomplete value = {urunadi} onChange={(event, value) => setUrunadi(value)}
              className="autocomplete"
              disablePortal
              options={urungir}
              isOptionEqualToValue={(option, value) => option === value || value === ''}
              renderInput={(params) => <TextField value={urunadi} onFocus={() => updateurungir()} className='auto_cmplete' {...params} label="Ürünler" />}
          />
    </div>
  
    <div> 

    <TextField type="number" 
     onChange={(e) => setHedef(e.target.value)}
     value={hedef} sx={{paddingRight:1.5,paddingTop:1.5}} label="Hedef Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number"  
     onChange={(e) => setTamamlanan(e.target.value)}
     value={tamamlanan} sx={{paddingRight:1.5,paddingTop:1.5}} label="Tamamlanan Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" 
     onChange={(e) => setFire(e.target.value)}
     value={fire} sx={{paddingRight:1.5,paddingTop:1.5}} label="Fire Miktarı" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" 
     onChange={(e) => setSevk(e.target.value)}
     value={sevk} sx={{paddingRight:1.5,paddingTop:1.5}} label="Sevk Edilecek Miktar" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" 
     onChange={(e) => setStok(e.target.value)}
     value={stok} sx={{paddingRight:1.5,paddingTop:1.5}} label="Stok Miktarı" variant="filled" inputProps={{ min: 0 }}/>

    <TextField type="number" 
     onChange={(e) => setPersonel_sayisi(e.target.value)}
     value={personel_sayisi} sx={{paddingRight:1.5,paddingTop:1.5}} label="Personel Sayisi" variant="filled" inputProps={{ min: 0 }}/>

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
        <Button onClick = {() => handleClear()}color="error" variant='contained' aria-label="add" sx={{marginTop:1}} endIcon={<DeleteForeverIcon/>}>
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
          <div>
             <Card className="date_card"
                      color='danger'
                      orientation="horizontal"
                      size="lg"
                      variant='outlined'
             >
                <div className='div_div'>
                  <EditCalendarIcon size='small'/>
                  Filtrele:
                  <div className="date_picker">
                    
                      <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="dd.MM.yyyy"
                          sx={{zIndex:1000}}
                      />
                      <DatePicker
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


      <div className='add_table' >
        <Stack className="add" sx={{ backgroundColor: '#28342b' }}></Stack>

        <Paper className="table">
          <TableVirtuoso
            // {...rows.sort((a, b) => b.id - a.id)}  // <--- SIRALAMA
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}

            sx={{ zIndex: 0 }}
          />
        </Paper>
        {/* ADD-BUTTON*/}
        <div className='data_tablebtns'>
       

          <Stack className='add_btn' sx={{color:'white'}}>
            EKLE
            <Fab color="error" onClick={show_input_part} sx={{ width: 35, height: 0 }}>
              <AddIcon />
            </Fab>
          </Stack>
          
          <Stack  className='add_btn' sx={{color:'white'}}>
            PDF İNDİR
            <Fab color='purple' onClick={exportTableToPDF} sx={{ width: 35, height: 0 }}>
              <AddIcon />
            </Fab>
          </Stack>

        </div>

      </div>
    </div>
  );
}