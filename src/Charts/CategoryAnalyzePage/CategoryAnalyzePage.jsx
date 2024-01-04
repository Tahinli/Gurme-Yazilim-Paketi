import {DateRangeP} from "./dateRangeForCategory.jsx";
import ControllableStates from "./getInputAutocomplete.jsx";
import Button from '@mui/material/Button';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import './CategoryAnalyze.css';
import { useState } from 'react';
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import StarsTwoToneIcon from '@mui/icons-material/StarsTwoTone';

import {
    BarAnimation,
    CategoryDailyAnalyzeComp,
    CategoryMonthlyAnalyzeComp,
    CategoryWeeklyAnalyzeComp, TopFiveProduct,
} from "./CategoryAnalyzeComponents.jsx";
import {Card} from "@mui/joy";
import React from "react";


export function CategoryAnalyzeP(){
    const [showDetails,setDetails]= useState(true);

    const show_details= () => {
     setDetails(!showDetails);
    }
    return (
        <div>
            <div className="top_five">
                <Card
                 className={"pie_card"}
                 color="danger"
                 invertedColors={false}
                 orientation="vertical"
                 size="lg"
                 variant="outlined"
                 sx={{width:'25.5%',minWidth:332,borderBlockWidth:15,
                 "--icon-size": "80px", alignSelf:'center'}}
                >
                <CardOverflow variant="soft" color="warning">
                
                  <AspectRatio
                    variant="outlined"
                    color="danger"
                    ratio="1.2"
                    sx={{
                      m: "auto",
                      transform: "translateY(10%)",
                      borderRadius: "50%",
                      width: "var(--icon-size)",
                      boxShadow: "lg",
                      bgcolor: "background.surface",
                      
                    }}
                  >
                    <div>
                      <StarsTwoToneIcon color="danger" sx={{ fontSize: "3.5rem" }} />
                    
                    </div>
                  </AspectRatio>
                  <p style={{fontSize:22,textAlign:'center',textShadow: '0.8px 0.8px red', textDecoration: 'overline',textDecorationStyle: 'double'}}>Verimliliği En Yüksek Ürünler</p>
                </CardOverflow>
                <TopFiveProduct/>
            </Card>

            <br/>
            </div>
            
            <div>
                <ControllableStates/>
            </div>

                <DateRangeP />


            <div className="pie_charts">

                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >
                    {<CategoryDailyAnalyzeComp/>}
                </Card>

                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >
                    {<CategoryWeeklyAnalyzeComp/>}
                </Card>




                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width: '30%'}}
                >


                    {<CategoryMonthlyAnalyzeComp/>}
                </Card>
            </div>

            <Button
                onClick={show_details}
                size='xlarge'
                color="error"
                variant="contained"
                aria-label="add"
            >
                {showDetails || false ? <ArrowCircleUpIcon/> : <ArrowCircleDownIcon/>}
            </Button>
            {showDetails && <Card
                className="detailed_chart"
                color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'100%', alignItems:'center'}}
                >
                    {<BarAnimation />}
                </Card>
            }
            <div>
            </div>
        </div>


    );
}