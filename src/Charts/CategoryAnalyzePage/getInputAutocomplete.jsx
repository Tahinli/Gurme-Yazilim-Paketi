import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Card} from "@mui/joy";
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import './CategoryAnalyze.css';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import urunApi from "../../api/urun-api.js";
import kategoriApi from "../../api/kategori-api.js";




export default function ControllableStates({ onValue2Change }) {
    const [ urunadi, setUrunadi ] = useState('');
    const [ kategoriadi, setKategoriadi ] = useState('');
    const [urungir, setUrungir] = useState([]);
    const [kategorigir, setKategorigir] = useState([]);
    const [Urunler, setUrunler] = useState([]);
    let options2=['']
    const [value, setValue] = React.useState('');
    const[value2,setValue2]=useState(options2[0])
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] =useState('');
    const navigate = useNavigate();
    let productName;
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
//ÜRÜNLERİN KATEGORİ DEĞERİNE GÖRE LİSTELENMESİ
    function updateurungir() {

        const newUrungir = [];
        for (let urun of Urunler) {
            if(urun.kategori_isim === kategoriadi)
                newUrungir.push(urun.isim);
        }
        setUrungir(newUrungir);
    }


    const goto_product= () => {
        { navigate(url) }
    };
//TÜRKÇE KARAKTER DEĞİŞİMİ
    const pName = (text) => {
        if(text !== null)
            return text.replaceAll('Ğ','g')
                .replaceAll('Ü','u')
                .replaceAll('Ş','s')
                .replaceAll('I','i')
                .replaceAll('İ','i')
                .replaceAll('Ö','o')
                .replaceAll('Ç','c')
                .replaceAll('ğ','g')
                .replaceAll('ü','u')
                .replaceAll('ş','s')
                .replaceAll('ı','i')
                .replaceAll('ö','o')
                .replaceAll('ç','c');
    };

    productName=pName(urunadi)
    const url = '/Products/' + encodeURI(productName);
    const [showProduct,setProducts]= useState(false);

    const show_products= () => {
        setProducts(!showProduct);
    }
    return (
        <div style={{paddingBottom:10,paddingTop:20}}>
            <Button
                className='detailed_productbtn'
                sx={{ width: 248,height:25,marginBottom: '10px'}}
                color='error'
                onClick={show_products}
                size='medium'
                variant="contained"
                endIcon={ showProduct || false ?  <ArrowCircleUpIcon/> : <ArrowCircleDownIcon/> }
            > Detaylı Ürün Analizi İçin:
            </Button >

            {showProduct &&<Card className='auto_card'
                                 color="neutral"
                                 invertedColors={false}
                                 orientation="vertical"
                                 size="lg"
                                 variant="soft"
                                 sx={{width:275, alignItems:'center'}}
            >
                <Autocomplete
                    value={kategoriadi}
                    onChange={(event, value) => {
                        setKategoriadi(value);

                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}

                    id="controllable-states-demo1"
                    options={kategorigir}
                    sx={{width: '60%', minWidth:150}}
                    //ÜRÜNLERİN BURADA KATEGORİ SEÇİMİNE GÖRE ATAMASI YAPILIYOR
                    renderInput={(params) => <TextField  onFocus={async () => await updatekategorigir()}  {...params} label="Kategori"/>}
                />

                {<Autocomplete
                    value={urunadi}

                    onChange={async (event, value) => {
                        setUrunadi(value);

                    }}
                    options={urungir}
                    inputValue={inputValue2}
                    onInputChange={(event, newInputValue) => {
                        setInputValue2(newInputValue)
                    }}
                    id="controllable-states-demo2"
                    autoHighlight={true}
                    sx={{width: '60%', minWidth:150}}
                    renderInput={(params) => <TextField onFocus={() => updateurungir()} {...params} label="Ürün"/>}
                />}

                <Button onClick={goto_product}
                        variant="contained"
                        color='error'
                        sx={{width: '40%', minWidth:120}}
                >
                    ÜRÜNE GİT
                </Button>
            </Card>}


        </div>
    );
}