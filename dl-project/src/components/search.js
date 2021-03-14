import React, {useState} from 'react'
import { makeStyles} from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {Box, Button, Grid,Card,CardContent,Typography,CardActions} from '@material-ui/core';
import LoadingOverlay from 'react-loading-overlay';
import BounceLoader from 'react-spinners/BounceLoader';
import ReactCardFlip from 'react-card-flip';
import ReactImageAppear from 'react-image-appear'



const useStyles = makeStyles({
  dropzone:{
    width:'60%',
    margin:'25px auto',
  },
  root: {
    width: 340,
    margin:'10px',
    borderRadius:'8px',
    webkitBoxShadow:' 1px 6px 26px 0px rgba(0,0,0,0.87)',
    mozBoxShadow: ' 1px 6px 26px 0px rgba(0,0,0,0.87)',
    boxShadow:' 1px 6px 26px 0px rgba(0,0,0,0.87)'
  },
  image:{
    width:'100%',
    height:'215px',

}
});



 function Search() {
   
   const classes = useStyles();
  
  const [loading, setLoading] = useState(false)
  const[fileInput,setFileInput]=useState([]) 
  const [result, setResult] = useState([])
  const [currentId1, setCurrentId1 ] = useState('')
  const [currentId2, setCurrentId2 ] = useState('')

 

  const uploadImage = async e => {
    setLoading(true)
    const formData = new FormData();
    formData.append('image', fileInput);
  
      const options = {
        method: 'POST',
        body: formData,
      };

      const res = await fetch(
        'http://127.0.0.1:5000/predict', options
      )
      const file =await res.json()
        
       setResult(file.predictions)
       setLoading(false)
  }

    function flip(idx,idx1){
      if(idx === currentId1 && idx1===currentId2){
          return true
      }
      else
          return false
    } 


  
 
  return (
      <React.Fragment>
    <Box component="div">
      
      <Grid className={classes.dropzone} container justify='center' alignItems='center'>
      <DropzoneArea
          style={{marginTop:'10px'}}
          acceptedFiles={['image/*']}
          dropzoneText={"Drag and drop an image here or click"}
          onChange={(file)=>{
            console.log(file[0])
          setFileInput(file[0])}}
          maxFileSize={5000000}
      />
      
      <Button
        variant="contained"
        color="basic" style={{marginTop:'10px',marginLeft:'10px',height:'50px',border:'3px solid black',borderRadius:'12px'}}
        startIcon={<CloudUploadIcon />}
        onClick={uploadImage}>
          Upload
      </Button>
      
      </Grid>

      {loading ? (
        <LoadingOverlay
            active={true}
            spinner={<BounceLoader />}
            text='Loading...'
        />
      ) : (

        <Grid container style={{margin:'10px auto'}}>  
        {result.map((it,idx) => (
          <React.Fragment>
          {it.map( (it1, idx1) => (
          <Grid item container xs={12} md={4} sm={6} justify="center" alignItems="center" key={idx1}>
            <ReactCardFlip isFlipped={flip.bind(this,idx,idx1)} flipDirection="vertical"> 
              <Card className={classes.root} >
              <CardContent>
              <ReactImageAppear 
                  src={it1.car_details.image}
                  loader="https://cache.dominos.com/nolo/ca/en/010048/assets/build/images/img/spinner.gif"
                  className={classes.image}
              />
              </CardContent>
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2"><b>{it1.car_details.name}</b></Typography>
                <Typography gutterBottom variant="h6" component="h2"><b>{(it1.confidence*100).toFixed(2)+"%"}</b></Typography>
              </CardContent>
              <CardActions style={{justifyContent: 'center'}}>
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCurrentId1(idx);
                      setCurrentId2(idx1)
                       }
                  }>
                        More>>
                  </Button>
              </CardActions>
              </Card>


              <Card className={classes.root}>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" >
                            <b>{it1.car_details.name}</b>
                        </Typography>
                        <hr/>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Fuel Type :</b> {it1.car_details.fuel_type}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Fuel Capacity :</b> {it1.car_details.fuel_tank_capacity}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Seating Capacity :</b> {it1.car_details.seating_capacity}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            <b>Body Type :</b> {it1.car_details.body_type}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                           <b>Transmission :</b>  {it1.car_details.transmission_type}
                        </Typography>
                        </CardContent> 
                        <hr/>
                        <CardActions style={{justifyContent: 'center'}}>
                        <Button 
                            variant="contained"  
                            color="primary" 
                            onClick={() => {
                              setCurrentId1('');
                              setCurrentId2('');
                            }}
                        >
                          More>>
                        </Button>
                        </CardActions>
                        </Card>

          </ReactCardFlip>
          </Grid>
          
          ))}
          <hr style={{width:'90%'}}/>
          </React.Fragment>
        ))}
        </Grid>
      )}
     
    </Box>
    
    </React.Fragment>
  )
}

export default Search
