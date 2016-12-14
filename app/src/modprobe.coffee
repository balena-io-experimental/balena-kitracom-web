Promise = require 'bluebird'
{ spawn, exec } = require 'child_process'
execAsync = Promise.promisify(exec)

exports.ap ->
  execAsync("modprobe -r dhd")
  .delay(2000)
  .then ->
    execAsync("modprobe dhd op_mode=2")

exports.normal ->
  execAsync("modprobe -r dhd")
  .delay(2000)
  .then ->
    execAsync("modprobe dhd")
