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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Urunler = await urunApi.getUrunler();
const Gunlukler = await gunlukApi.getGunlukler();
// const urungir = (await urunApi.getUrunler()).map((urun) => urun.isim);
const kategorigir = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);

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
      {/* <TableCell padding="checkbox"
         sx={{
            backgroundColor: '#28342b',
            maxWidth:'48px',
            borderBottomWidth: 0,
          }}
        >
        </TableCell>
        <TableCell padding="checkbox"
         sx={{
            backgroundColor: '#28342b',
            paddingLeft:4,
            fontSize:17,
            maxWidth:'78px',
            color:'white',
            borderBottomWidth: 0,
          }}
        >  İşlemler
        </TableCell> */}
    </TableRow>
  );
}



export default function DContainer() {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  /// ilk rows'u oluşturmak için
  const [rows, setRows] = useState(
    Array.from({ length: Gunlukler.length }, (_, index) => {
      const Selection = Gunlukler[index];
      return createData(index, Selection.urun_isim,
        Selection.tarih, Selection.hedeflenen,
        Selection.ulasilan, Selection.atilan,
        Selection.personel_sayisi, Selection.sevk, Selection.stok);
    })
  );

  React.useEffect(() => {
    const sortedRows = rows.sort((a, b) => {
      const dateA = new Date(a.tarih.split('.').reverse().join('-'));
      const dateB = new Date(b.tarih.split('.').reverse().join('-'));
      return dateB - dateA;
    });
    setRows(sortedRows);

  }, [rows]);
  /////////////////////////////////////////

  const [urunadi, setUrunadi] = useState('');
  const [kategoriadi, setKategoriadi] = useState('');
  const [hedef, setHedef] = useState(0); //hedeflenen
  const [tamamlanan, setTamamlanan] = useState(0); //ulasilan
  const [fire, setFire] = useState(0); //atilan
  const [sevk, setSevk] = useState(0);
  const [stok, setStok] = useState(0);
  const [personel_sayisi, setPersonel_sayisi] = useState(0);
  const [tarih, setTarih] = useState(''); //tarih

  const exportTableToPDF = () => {

    const data = rows.map(row => ({
      urun_isim: row.urun_isim,
      tarih: row.tarih,
      hedeflenen: row.hedeflenen,
      ulasilan: row.ulasilan,
      atilan: row.atilan,
      personel_sayisi: row.personel_sayisi,
      sevk: row.sevk,
      stok: row.stok
    }));

    const doc = new jsPDF()

    const columns = [
      { header: 'Urun Adı', dataKey: 'urun_isim' },
      { header: 'Tarih', dataKey: 'tarih' },
      { header: 'Hedeflenen', dataKey: 'hedeflenen' },
      { header: 'Ulaşılan', dataKey: 'ulasilan' },
      { header: 'Fire', dataKey: 'atilan' },
      { header: 'Personel Sayısı', dataKey: 'personel_sayisi' },
      { header: 'Sevk', dataKey: 'sevk' },
      { header: 'Stok', dataKey: 'stok' },
    ];

    autoTable(doc, {
      columns,
      body: data,
      styles: { cellWidth: 'wrap' }, // Wraps cell text if it's too wide
      margin: { top: 15, right: 10, bottom: 10, left: 10 }, // Adjusts the margin
      didDrawPage: (data) => {
        doc.setFontSize(10)
        doc.text(`${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10)

        let text = `Tarih: ${getTodayDate()}`
        let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor
        let textOffset = doc.internal.pageSize.width - textWidth - data.settings.margin.right // subtract margin.right for padding

        // Move the text to the top right of the page
        doc.text(text, textOffset, 10) // 10 units from the top of the page
      },
    });

    doc.save("Data-Report.pdf")
  }


  const urungir = [];
  for (let urun of Urunler) {
    if (urun.kategori_isim === kategoriadi)
      urungir.push(urun.isim);
  }

  // console.log(Gunlukler)



  const [value, setValue] = useState([
    dayjs('2022-04-17'),
    dayjs('2022-04-21'),
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
  const handleEdit = async (row, _personel_sayisi, _hedef, _tamamlanan, _fire, _stok, _sevk, _tarih) => {
    console.log('edit')
    console.log(row, parseInt(_personel_sayisi), parseInt(_hedef), parseInt(_tamamlanan), parseInt(_fire), parseInt(_stok), parseInt(_sevk), _tarih)
    try {
      await gunlukApi.updateGunluk(`${row.urun_isim}`, `${row.tarih}`, {
        yeni_urun: row.urun_isim,
        yeni_personel_sayisi: parseInt(_personel_sayisi),
        yeni_hedeflenen: parseInt(_hedef),
        yeni_ulasilan: parseInt(_tamamlanan),
        yeni_atilan: parseInt(_fire),
        yeni_stok: parseInt(_stok),
        yeni_sevk: parseInt(_sevk),
        yeni_tarih: _tarih,  ///DUZENLE
      });
      const updatedRow = {
        ...row,
        personel_sayisi: parseInt(_personel_sayisi),
        hedef: parseInt(_hedef),
        tamamlanan: parseInt(_tamamlanan),
        fire: parseInt(_fire),
        stok: parseInt(_stok),
        sevk: parseInt(_sevk),
        tarih: _tarih,
      };

      // Create a new rows array with the updated row
      const updatedRows = [
        ...rows.slice(0, row.id),
        updatedRow,
        ...rows.slice(row.id + 1),
      ];

      // Update the rows state
      setRows(updatedRows);
    } catch (error) {
      console.error("An error occurred while updating:", error);
    }
    finally {
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
              sx={{ backgroundColor: 'rgb(209, 209,209)' }}
            >
              {row[column.dataKey]}
            </TableCell>
            :
            <TableCell align="right" key={column.dataKey} sx={{ backgroundColor: 'rgb(209, 209,209)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => handleDelete(row)}
                  size="small" // makes the button smaller
                  variant="contained" // gives the button an outline
                  color="error"
                  endIcon={<DeleteForeverIcon />}
                >
                  Sil
                </Button >
                <div>
                  <Button
                    className='table_btn'
                    onClick={handleClickOpen}
                    size='small'
                    color="success"
                    variant="contained"
                    aria-label="add"
                    endIcon={<BorderColorIcon />}
                  >
                    Düzenle
                  </Button>

                  <Dialog open={open} onClose={handleClickClose} maxWidth="xl" >
                    <DialogTitle sx={{ backgroundColor: 'rgb(72, 194, 102)' }}>DÜZENLE</DialogTitle>
                    <p style={{ paddingLeft: 20, marginBottom: 0, color: 'red', fontSize: 17 }}
                    >
                      (Tarihi 'gg.aa.yyyy' Şeklinde Giriniz.)
                    </p>

                    <Card
                      color='neutral'
                      orientation="horizontal"
                      size="lg"
                      variant='soft'
                      sx={{ width: '100%' }}
                    >
                      <TextField onChange={(e) => setPersonel_sayisi(e.target.value)} type="number" autoFocus margin="dense" label="Personel Sayısı" fullWidth />
                      <TextField onChange={(e) => setTarih(e.target.value)} margin="dense" label="Tarih" fullWidth />
                      <TextField onChange={(e) => setHedef(e.target.value)} type="number" autoFocus margin="dense" label="Hedef" fullWidth />
                      <TextField onChange={(e) => setTamamlanan(e.target.value)} type="number" margin="dense" label="Tamamlanan" fullWidth />
                      <TextField onChange={(e) => setFire(e.target.value)} type="number" autoFocus margin="dense" label="Fire" fullWidth />
                      <TextField onChange={(e) => setSevk(e.target.value)} type="number" margin="dense" label="Sevk" fullWidth />
                      <TextField onChange={(e) => setStok(e.target.value)} type="number" autoFocus margin="dense" label="Stok" fullWidth />
                    </Card>

                    <DialogActions sx={{ alignItems: 'left' }}>
                      <Button variant="contained" color="error" onClick={handleClickClose}>İptal</Button>
                      <Button variant="contained" color="success" onClick={() => handleEdit(row, personel_sayisi, hedef, tamamlanan, fire, stok, sevk, tarih)}>Güncelle</Button>
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
            <CancelIcon className="close_btn" onClick={close_input_part} />
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
              renderInput={(params) => <TextField className='auto_cmplete' {...params} label="Ürün Kategorisi" />}
            />
            <Autocomplete onChange={(event, value) => setUrunadi(value)}
              className="autocomplete"
              disablePortal
              options={urungir}
              renderInput={(params) => <TextField className='auto_cmplete' {...params} label="Ürünler" />}
            />
          </div>

          <div className='input_part'>

            <TextField type="number" defaultValue={0}
              onChange={(e) => setHedef(e.target.value)}
              sx={{ paddingRight: 1.5 }} label="Hedef Miktar" variant="filled" inputProps={{ min: 0 }} />

            <TextField type="number" defaultValue={0}
              onChange={(e) => setTamamlanan(e.target.value)}
              sx={{ paddingRight: 1.5 }} label="Tamamlanan Miktar" variant="filled" inputProps={{ min: 0 }} />

            <TextField type="number" defaultValue={0}
              onChange={(e) => setFire(e.target.value)}
              sx={{ paddingRight: 1.5 }} label="Fire Miktarı" variant="filled" inputProps={{ min: 0 }} />

            <TextField type="number" defaultValue={0}
              onChange={(e) => setSevk(e.target.value)}
              sx={{ paddingRight: 1 }} label="Sevk Edilecek Miktar" variant="filled" inputProps={{ min: 0 }} />

            <TextField type="number" defaultValue={0}
              onChange={(e) => setStok(e.target.value)}
              sx={{ paddingRight: 1.5 }} label="Stok Miktarı" variant="filled" inputProps={{ min: 0 }} />

            <TextField type="number" defaultValue={0}
              onChange={(e) => setPersonel_sayisi(e.target.value)}
              sx={{ paddingRight: 1.5 }} label="Personel Sayisi" variant="filled" inputProps={{ min: 0 }} />

            <Stack className="field_btn">
              <Button color="success" variant='contained' aria-label="add"
                sx={{ marginTop: 1 }} onClick={handleClick} endIcon={<LoupeIcon />}
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

            <Stack className="field_btn">
              <Button color="error" variant='contained' aria-label="add" sx={{ marginTop: 1 }} endIcon={<DeleteForeverIcon />}>
                SIFIRLA
              </Button>
            </Stack>
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
              <Button className='list_btn' color="error" variant='contained' aria-label="add" sx={{ marginTop: 1 }}>LİSTELE</Button>
            </div>
            <img src="src/assets/img/genel.png"></img>
          </div>

        </Card></div>


      <div className='add_table' >
        <Stack className="add" sx={{ backgroundColor: '#28342b' }}></Stack>

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
          <Fab color="error" onClick={show_input_part} sx={{ width: 35, height: 0 }}>
            <AddIcon />
          </Fab>
          <button onClick={exportTableToPDF}>Export to PDF</button>
        </Stack>
      </div>

    </div>
  );
}