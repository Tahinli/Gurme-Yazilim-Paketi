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
  ["Frozen yoghurt", 159, 6.0, 24, 4.0],
  ["Ice cream sandwich", 237, 9.0, 37, 4.3],
  ["Eclair", 262, 16.0, 24, 6.0],
  ["Cupcake", 305, 3.7, 67, 4.3],
  ["Gingerbread", 356, 16.0, 49, 3.9],
];
const sample2 = [
  ["Frozen yoghurt"],
  ["Ice cream sandwich"],
  ["Eclair"],
  ["Cupcake"],
  ["Gingerbread"],
];

function createData(id, dessert, calories) {
  return { id, dessert, calories };
}

const columns = [
  {
    width: 20,
    label: "Ürünler",
    dataKey: "dessert",
  },
  {
    width: 20,
    label: "Tarih",
    dataKey: "calories",
    numeric: true,
  },
  {
    width: 20,
    label: "Sevk Miktarı",
    dataKey: "fat",
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
            <CancelIcon className="close_btn" onClick={close_input_part} />
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
            <div className="autocomplete2">
              <Autocomplete
                className="autocomplete2"
                disablePortal
                options={sample2}
                renderInput={(params) => (
                  <TextField
                    className="auto_cmplete2"
                    {...params}
                    label="Ürün Katagorisi"
                  />
                )}
              />
              <Autocomplete
                className="autocomplete2"
                disablePortal
                options={sample2}
                renderInput={(params) => (
                  <TextField
                    className="auto_cmplete2"
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
