// Недобросовестный владелец авто пытается продать свою машину с пробегом как новую,
// воспользовавшись услугами хакера, который подкручивает ему пробег.
// Восстановите справедливость: сделайте так, чтобы машину нельзя было взломать.

// Абсолютно правильного ответа нет, цели можно добиться разными путями.
// Задача не сложная, но с огромным простором для креатива. Все зависит только от вас.
// Выкидывать персонажей нельзя, но можно добавлять своих.
// Исправьте ошибки, если они вам попадутся. И вообще, отшлифуйте код.
// Нам интересно любое решение. В идеале, вместе с решением мы ждем краткого объяснения,
// почему были сделаны те или иные изменения (в виде комментариев).
// Использование TypeScript будет дополнительным плюсом.
// Удачи!

// сделам класс car для использования модификаторов прав доступа и защитим историю и пробег от редактирования
class Car { 
  name;
  #distancePassed = 0;
  #driveHistory = [];

  constructor(name) {
    this.name = name;
  }
  
  get distancePassed() {
    return this.#distancePassed;
  }
  get driveHistory() {
    return this.#driveHistory;
  }

  beep = function (message) {
    console.log(this.name + ": " + "Beeeeep!" + (message ? " "  + message : ""));   
    //логичнее выглядит прибавлять строку сообщения только в случае истинности условия
  };
  
  drive = function (distance) {
    this.beep();
    if (distance <=0) {
      console.log("Incorrect value. Distance can't be equal zero or negative value");
      return;
    }
    this.#distancePassed += distance;
    let that = this;
    this.#driveHistory.push(function () {
      return {
        time: new Date().getTime(),
        currentDistance: distance,
        overallDistance: that.#distancePassed,
      };
    });
    console.log(
      "Done. Kilometers passed: " +
        distance +
        ". Overall: " +
        this.#distancePassed
    );
  };
}
var hacker = {
  hackCar: function (car) {
    var hackedHistory = [];
    let ctr = 0;
    for (var i = 0; i < car.driveHistory.length; i++) {
      var historyRecord = car.driveHistory[i]();
      hackedHistory.push(function () {
        let item = {
          time: historyRecord.time,
          currentDistance: 100,
          overallDistance: 100 * ++ctr,
        };
        return item;
      });
    }
    try {
      car.driveHistory = hackedHistory;      
    } catch (err) {
      console.log("Warning! Somebody is trying to hack car's history!! Car's drive history is protected and can't be change!");
    }
    return car;
  },
  hackCar2: function (car) {
    // попробуем уменьшить пробег другим способом
    let distance = Math.floor(car.distancePassed / 2);
    car.drive(-distance);
    return car;
  }    
};
//функция getCustomer должна быть описана до owner, который ее вызывает
var getCustomer = function () {
  var customer = {
    buyCar: function (car) {
      var summ = 0;
      for (var i = 0; i < car.driveHistory.length; i++) {
        var historyRecord = car.driveHistory[i]();
        summ += historyRecord.overallDistance - historyRecord.currentDistance;
      }
      if (summ > 100000) {
        console.log("I don't want to buy an old car");
        return false;
      } else {
        console.log("OK! I like your car. I buy it.");
        return true;
      }
    },
  };
  return customer;
};
var owner = {
  sellCar: function () {
    var customer = getCustomer();
    if (customer.buyCar(this.car)) {
      console.log("Yay, I'm happy! I sold my old car!");
    } else {
      console.log("Aha. Let's hack this car and try to sell it again.");      
      let origDistance = this.car.distancePassed;
      this.car = hacker.hackCar(this.car);
      if (this.car.distancePassed < origDistance) { // check if car is successfuly hacked
        this.sellCar();
      } else {       
        this.car = hacker.hackCar2(this.car); 
        if (this.car.distancePassed < origDistance) { // check if car is successfuly hacked
          this.sellCar();
        } else {
          console.log("I can't hack this car! (( ");    
        }  
      }
    }
  },
  useCar: function () {
    this.car.drive(18000);
    this.car.drive(22500);
    this.car.drive(98118);
    console.log("Enough. I want to sell this car.");
    this.sellCar();
  },
};
var superCar = new Car("Supercar");
owner.car = superCar;
owner.useCar();

