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


const options = ['Hamur', 'Tatlı','İçecek'];

export default function ControllableStates({ onValue2Change }) {
    let options2=['']
    const [value, setValue] = React.useState('');
    const[value2,setValue2]=useState(options2[0])
    const [inputValue, setInputValue] = useState('');
    const [inputValue2, setInputValue2] =useState('');
    const navigate = useNavigate();
    let productName;

    const goto_product= () => {
        { navigate('/Products/'+productName) }
      };
   function setProduct(newData){
       setValue(newData)
   }
   if(value==='Hamur'){

        options2=['Mantı','Kete','Poğaça']
    }
    else if(value==='Tatlı'){

        options2=['Waffle','Kek','Baklava','Çikolata']
    }
    else if(value==='İçecek'){

        options2=['Şalgam','Kola']
    }
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
    productName=pName(value2)
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
                    value={value}
                    onChange={(event, newValue) => {
                        setProduct(newValue);
                        setValue2('')
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}

                    id="controllable-states-demo1"
                    options={options}
                    sx={{width: '60%', minWidth:150}}
                    renderInput={(params) => <TextField {...params} label="Kategori"/>}
                />
               
                {<Autocomplete
                    value={value2}
                    onChange={(event, newValue) => {
                        setValue2(newValue);
                    }}
                    options={options2}
                    inputValue={inputValue2}
                    onInputChange={(event, newInputValue) => {
                        setInputValue2(newInputValue)
                    }}
                    id="controllable-states-demo2"
                    autoHighlight={true}
                    sx={{width: '60%', minWidth:150}}
                    renderInput={(params) => <TextField {...params} label="Ürün"/>}
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