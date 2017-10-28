import datetime as dt

class Chart:
  def __init__(self):
    self.lists = [[],[],[],[]]

  def addTemperature(self,hour,temp):
    if hour<6:
      self.lists[0].append(temp)
    elif hour <12 :
      self.lists[1].append(temp)
    elif hour < 18:
      self.lists[2].append(temp)
    else:
      self.lists[3].append(temp)
  def addTemp(self,temp):
      self.addTemperature(dt.datetime.now().hour,temp)

  def getAverage(self,index):
      size = len(self.lists[index])
      if size == 0:
          return 0
      value = 0.0
      for x in self.lists[index]:
          value = value + x
      return value / size

  def getAverages(self):
      return [self.getAverage(0),self.getAverage(1),self.getAverage(2),self.getAverage(3)]
