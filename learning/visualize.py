import numpy as np
import re
import click
from matplotlib import pylab as plt


@click.command()
@click.argument('files', nargs=-1, type=click.Path(exists=True))
def main(files):
    plt.style.use('ggplot')
    fig, ax1 = plt.subplots()
    ax1.set_xlabel('iteration')
    ax1.set_ylabel('loss')
    for i, log_file in enumerate(files):
        loss_iterations, losses = parse_log(log_file)
        disp_results(fig, ax1, loss_iterations, losses, color_ind=i)
    plt.show()


def parse_log(log_file):
    with open(log_file, 'r') as log_file:
        log = log_file.read()

    loss_pattern = r"l2_error = (?P<loss_val>[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?)"
    losses = []
    loss_iterations = []

    count = 0
    for r in re.findall(loss_pattern, log):
        loss_iterations.append(count)
        count += 100
        losses.append(float(r[0]))

    loss_iterations = np.array(loss_iterations)
    losses = np.array(losses)

    return loss_iterations, losses


def disp_results(fig, ax1, loss_iterations, losses, color_ind=0):
    modula = len(plt.rcParams['axes.color_cycle'])
    ax1.plot(loss_iterations, losses, color=plt.rcParams['axes.color_cycle'][(color_ind * 2 + 0) % modula])

if __name__ == '__main__':
    main()