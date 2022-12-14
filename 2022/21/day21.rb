# frozen_string_literal: true

SCRIPT = <<FOO
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
FOO

BIG_SCRIPT = File.open("/Users/ndp/workspace/advent-of-code/2022/21/big_script.txt").read

COMMANDS =
  BIG_SCRIPT
    .split("\n")
    .reject { |line| line == "" }
    .map { |line| line.split(': ') }
    .map { |name, expr|
      ["@#{name}", expr.gsub(/(\w\w\w\w)/, '@\1')]}

playground = Object.new
while (!playground.instance_variable_defined?('@root')) do
  COMMANDS.each do |(name, value)|
    next if playground.instance_variable_defined?(name.to_sym)
    begin
      playground.instance_eval("#{name} = #{value}")
    rescue NameError, NoMethodError, NilClass, TypeError
      playground.instance_eval("#{name} = nil")
      playground.remove_instance_variable(name)
    end
  end
end

pp "Root monkey yells": playground.instance_variable_get('@root')
pp "Expected:        ": 324122188240430
