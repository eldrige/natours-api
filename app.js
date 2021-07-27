const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 2000;

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


app.get('/api/v1/tours/:id', (req, res) => {
  const tour = tours.find((elt) => elt.id === +req.params.id)
  res.status(200).json({
    status: "success",
    data:{
      tour
    }
  })
});


app.patch('/api/v1/tours/:id', (req, res) => {
  console.log("yay")
})

app.delete('/api/v1/tours/:id', (req, res) => {
  
  res.status(204).json({
    status: "success",
    data: null
  })
})


app.get('/api/v1/tours', (req, res) => {
  res.json({
    data: {
      results: tours.length,
      tours,
    },
  });
});



app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.get('/', (req, res) => {
  res.send('Natours API');
});


app.listen(PORT, () => console.log(`Server is accepting request at: ${PORT} `));
