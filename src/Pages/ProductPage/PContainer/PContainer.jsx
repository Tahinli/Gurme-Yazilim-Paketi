import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Card from "@mui/joy/Card";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import LoupeIcon from "@mui/icons-material/Loupe";
import { keyframes } from "@mui/system";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import CardContent from "@mui/joy/CardContent";
import Snackbar from "@mui/joy/Snackbar";
import PlaylistAddCheckCircleRoundedIcon from "@mui/icons-material/PlaylistAddCheckCircleRounded";
import urunApi from "../../../api/urun-api";
import kategoriApi from "../../../api/kategori-api";
import Autocomplete from '@mui/material/Autocomplete';
import CategoryIcon from '@mui/icons-material/Category';

const urunler = await urunApi.getUrunler();
// const urunler = (await urunApi.getUrunler()).map((urun) => urun.isim);
const kategoriler = (await kategoriApi.getKategoriler()).map(
  (kategori) => kategori.isim
);
const butunKategoriler = await kategoriApi.getKategoriler();

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

function createData(id, isim, kategori) {
  return {
    id,
    isim,
    kategori,
  };
}

const rows = Array.from({ length: urunler.length }, (_, index) => {
  return createData(index, urunler[index].isim, urunler[index].kategori);
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "isim",
    numeric: false,
    disablePadding: true,
    label: "Ürün Adı",
  },
  {
    id: "kategori",
    numeric: true,
    disablePadding: false,
    label: "Ürün Kategorisi",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding="checkbox"
          sx={{
            backgroundColor: "rgb(209, 209,209)",
          }}
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              backgroundColor: "rgb(126, 126, 126)",
              color: "white",
              fontSize: 35,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <p
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </p>
      ) : (
        <p
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Ürünler
        </p>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon onClick={handleDelete} />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

// ************************* ANA FONKSIYON  ********************************
export default function PContainer() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("isim");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //vvvvvvvvvvvvvvv textfieldlar için vvvvvvvvvvvvvvv
  const [urunadi, setUrunadi] = useState("");
  const [urunkategorisi, setUrunkategorisi] = useState("");
  const animationDuration = 600;

  // console.log(butunKategoriler);
  // console.log(urunadi);
  // console.log(urunkategorisi);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );
  const [massage, setMassage] = useState(false);

  const addclick = async () => {
    //vvvvvvvvvvvvvv KATEGORI EKLE vvvvvvvvvvvvvvv   (ŞUAN HEM KATEGORİ HEMDE ÜRÜN EKLENİYOR DÜZELTİLECEK)
    
    
      if (!kategoriler.includes(urunkategorisi)) 
      {
        
          await kategoriApi.addKategori({
          isim: urunkategorisi,
          ust_kategori: null,
        });
        kategoriler.push(urunkategorisi);
      }
    //vvvvvvvvvvvvvv URUN EKLE vvvvvvvvvvvvvvv
    
        await urunApi.addUrun({
        isim: urunadi,
        kategori: urunkategorisi,
        });
    setMassage(true);
    
  };

  const handleClose2 = () => {
    setMassage(false);
  };
  const [ urunadi1, setUrunadi1 ] = useState('');
  const [ kategoriadi, setKategoriadi ] = useState(''); 
  const [kategorigir, setKategorigir] = useState([]);
  async function updatekategorigir() {
    console.log('updatekategorigir')
    try {
      const newKategorigir = (await kategoriApi.getKategoriler()).map((kategori) => kategori.isim);
      setKategorigir(newKategorigir);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="product_body">

      <div className="pp_input">
        <Card
          className="p_inputcard"
          sx={{
            textAlign: "center",
            alignItems: "center",
            overflow: "auto",
            "--icon-size": "100px",
          }}
        >
          <CardOverflow variant="solid" color="neutral">
            <AspectRatio
              variant="outlined"
              color="success"
              ratio="1"
              sx={{
                m: "auto",
                transform: "translateY(50%)",
                borderRadius: "50%",
                width: "var(--icon-size)",
                boxShadow: "sm",
                bgcolor: "background.surface",
                position: "relative",
              }}
            >
              <div>
                <FoodBankIcon color="success" sx={{ fontSize: "4rem" }} />
              </div>
            </AspectRatio>
          </CardOverflow>

          <CardContent sx={{ maxWidth: "40ch" }} className="p_cardcontent">
            <h4 className="p_header">Ürün Ekle</h4>
            <Autocomplete value={kategoriadi} onChange={(event, value) => {
              setKategoriadi(value);
              setUrunadi(null);
              }}
              options={kategorigir}
              renderInput={(params) => <TextField value={kategoriadi} onFocus={async () => await updatekategorigir()} {...params} label="Ürün Kategorisi" />}
          />
            <TextField
              id = "urunadi"
              type="text"
              onChange={(e) => setUrunadi(e.target.value)}
              sx={{ paddingTop: 1.5 }}
              label="Ürün Adı"
              variant="filled"
            />
            <Button
              className="save_btn"
              onClick={addclick}
              color="success"
              variant="contained"
              aria-label="add"
              sx={{ marginTop: 1 }}
              endIcon={<LoupeIcon />}
            >
              KAYDET
            </Button>
          </CardContent>

          {/* ANİMATİON-MASSAGE */}
          <Snackbar
            variant="soft"
            color="success"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={massage}
            onClose={handleClose2}
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
            Ürün Başarıyla Kaydedildi
          </Snackbar>
        </Card>


{/*KATEGORİ CARD*/}
        <Card
          className="p_inputcard"
          sx={{
            textAlign: "center",
            alignItems: "center",
            overflow: "auto",
            "--icon-size": "100px",
          }}
        >
          <CardOverflow variant="solid" color="neutral">
            <AspectRatio
              variant="outlined"
              color="warning"
              ratio="1"
              sx={{
                m: "auto",
                transform: "translateY(50%)",
                borderRadius: "50%",
                width: "var(--icon-size)",
                boxShadow: "sm",
                bgcolor: "background.surface",
                position: "relative",
              }}
            >
              <div>
                <CategoryIcon color="warning" sx={{ fontSize: "4rem" }} />
              </div>
            </AspectRatio>
          </CardOverflow>

          <CardContent sx={{ maxWidth: "40ch" }} className="p_cardcontent">
            <h4 className="p_header">Kategori Ekle</h4>
          
            <TextField
              id = "urunkategorisi"
              type="text"
              onChange={(e) => setUrunkategorisi(e.target.value)}
              sx={{ paddingTop: 1.5 }}
              label="Kategori Adı"
              variant="filled"
            />
            <Button
              className="save_btn"
              onClick={addclick}
              color="warning"
              variant="contained"
              aria-label="add"
              sx={{ marginTop: 1 }}
              endIcon={<LoupeIcon />}
            >
              KAYDET
            </Button>
          </CardContent>

          {/* ANİMATİON-MASSAGE */}
          <Snackbar
            variant="soft"
            color="warning"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={massage}
            onClose={handleClose2}
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
            Kategori Başarıyla Kaydedildi
          </Snackbar>
        </Card>
      </div>

<div className="p_box_div">

      <h1 className="p_h1">ÜRÜN TABLOSU</h1>
      <Box sx={{ width: "80%" }} className="p_box">
        <Paper >
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              className="p_table"
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody
                sx={{
                  backgroundColor: "rgb(190, 190, 190)",
                  color: "white",
                  fontSize: 30,
                }}
              >
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{
                          backgroundColor: "rgb(209, 209,209)",
                        }}
                      >
                        <Checkbox
                          color="success"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={{color: "black" }}
                      >
                        {row.isim}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "black" }}
                      >
                        {row.kategori.isim}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{paddingBottom:10}}
          />
        </Paper>
      </Box>
      </div>
    </div>
  );
}
