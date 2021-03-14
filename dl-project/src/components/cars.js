import React,{useState,useEffect} from "react";
import {Grid,Box,Card,CardContent,Typography,InputAdornment,TextField, Button,CardActions} from '@material-ui/core'
import { makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactCardFlip from 'react-card-flip';
import ReactImageAppear from 'react-image-appear'


const useStyles = makeStyles({
    loader:{
        position:'absolute',
        top:'50%',
        left:'50%'
    },
    root: {
        width: 340,
        margin:'10px',
        borderRadius:'8px',
        webkitBoxShadow:' 1px 6px 26px 0px rgba(0,0,0,0.87)',
        mozBoxShadow: ' 1px 6px 26px 0px rgba(0,0,0,0.87)',
        boxShadow:' 1px 6px 26px 0px rgba(0,0,0,0.87)'
       
      },
      select:{
          margin:'20px auto',
      },
      image:{
          width:'100%',
          height:'215px'
      }
    
});


function Cars() {
    const classes = useStyles();


    const [page, setPageNo]=useState(1);
    const [loading,setLoading] = useState(false);
    const [cardata,setcars] = useState([]);
    const [search,setsearch] = useState('');
    const [invalid, setInvalid]=useState(false);
    const [currentId, setCurrentId ] = useState('')

    
        const searchFunc = async() => {
            const data=await fetch ("http://127.0.0.1:5000/cars?search="+search+"&page="+page);
            const jdata=await data.json();
            setInvalid( jdata.invalidPage);
            setcars( [...cardata, ...jdata.cars]);
            setLoading(true);
        }
        useEffect(()=>{
            searchFunc();
        },[search, page])

        function flip(idx){
            if(idx === currentId){
                return true
            }
            else
                return false
        }
        
        if(loading === false)
        {
            return(
                <div>
                <div className={classes.loader}>
                    <CircularProgress size="5rem" style={{color:"black"}}/>
                </div>
                </div>   
            );
            
        }
        else{

        return(
            <Box component="div">    
                <Grid container justify='center' alignItems='center' className={classes.select}>
                <TextField 
                style={{width:'70%'}}
                autoComplete="off"
                id="outlined-basic" 
                variant="outlined"
                label="Search Cars"
                onChange={ (e) => {
                    setcars([]);
                    setsearch(e.target.value)
                    setPageNo(1)
                   }}
                    InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="large"/>
                          </InputAdornment>
                        )
                      }} />
                </Grid>
                
                
                <InfiniteScroll
                    dataLength={cardata.length} 
                    next={() => {
                        console.log("next");
                        setPageNo(page+1)}}
                    hasMore={!invalid}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <h2>Yay! You have seen it all</h2>
                        </p>
                    }
                    scrollThreshold={0.8}
                >
                
                
                    <Grid container style={{margin:"10px auto",paddingTop:'20px'}} >
                    
                    {cardata.map((it,idx)=>(
                    <Grid item container xs={12} md={4} sm={6} justify="center" alignItems="center" key={idx}>
                        <ReactCardFlip isFlipped={flip.bind(this, idx)} flipDirection="vertical">
                        <Card className={classes.root}>
                        <CardContent>
                        
                         <ReactImageAppear 
                            src={it.image}
                            loader="https://cache.dominos.com/nolo/ca/en/010048/assets/build/images/img/spinner.gif"
                            className={classes.image}
                        />
                        </CardContent>
                        <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                           <b>{it.name}</b> 
                        </Typography>
                        </CardContent>
                        <CardActions style={{justifyContent: 'center'}}>
                        <Button variant="contained" color="primary" onClick={() => setCurrentId(idx) }>More>></Button>
                        </CardActions>
                        </Card>
                    
                    {/* backend side of card */}

                        <Card className={classes.root}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" >
                            <b>{it.name}</b>
                        </Typography>
                        <hr/>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Fuel Type :</b> {it.fuel_type}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Fuel Capacity :</b> {it.fuel_tank_capacity}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Seating Capacity :</b> {it.seating_capacity}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Body Type :</b> {it.body_type}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                           <b>Transmission :</b>  {it.transmission_type}
                        </Typography>
                        </CardContent> 
                        <hr/>
                        <CardActions style={{justifyContent: 'center'}}>
                        <Button variant="contained"  color="primary" onClick={() => setCurrentId('')}>More>></Button>
                        </CardActions>
                        </Card>
                        </ReactCardFlip>

                    </Grid>
                ))}
                                
                    </Grid>

            </InfiniteScroll>

            </Box>
            
            );
        }
}

export default Cars;
