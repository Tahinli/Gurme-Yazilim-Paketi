import {DateRangeP} from "./dateRangeForCategory.jsx";
import ControllableStates from "./getInputAutocomplete.jsx";
import Button from '@mui/material/Button';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import './CategoryAnalyze.css';
import { useState } from 'react';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {
    BarAnimation,
    CategoryDailyAnalyzeComp,
    CategoryMonthlyAnalyzeComp,
    CategoryWeeklyAnalyzeComp,
} from "./CategoryAnalyzeComponents.jsx";
import {Card} from "@mui/joy";
import React from "react";

export function CategoryAnalyzeP(){
    const [showDetails,setDetails]= useState(false);

    const show_details= () => {
     setDetails(!showDetails);
    }
    return (
        <div >
            <div className={"ChartsDiv"}>
                <ControllableStates/>
            </div>
            <br/>
          <DateRangeP/>
            <div className="pie_charts" >
                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<CategoryDailyAnalyzeComp />}
                </Card>

                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<CategoryWeeklyAnalyzeComp />}
                </Card>

                <Card className={"pie_card"}
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'30%'}}
                >
                    {<CategoryMonthlyAnalyzeComp />}
                </Card>
            </div>

        <Button 
          onClick={show_details}
          size='small'
          color="error" 
          variant="contained"
          aria-label="add"  
          endIcon={ showDetails || false ?  <ArrowCircleUpIcon/> : <ArrowCircleDownIcon/> }
        >
          Detaylı Bilgi İçin Tıklayınız
        </Button >
            {showDetails && <Card 
                      className="detailed_chart"
                      color="neutral"
                      invertedColors={false}
                      orientation="vertical"
                      size="lg"
                      variant="soft"
                      sx={{width:'100%', alignItems:'center'}}
                >
                     <Button 
                        id="zoomin_btn"
                        size='small'
                        color="success" 
                        variant="contained"
                        aria-label="add"  
                        endIcon={ <ZoomInIcon/> }
                    >
                        Büyüt
                    </Button >
                    {<BarAnimation />}
                </Card>
            }
            <div>
            </div>
        </div>


    );
}