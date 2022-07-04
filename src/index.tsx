import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore - sass перестал поддерживаться и на сколько я понимаю, не типизирован, тс будет ругаться
import styles from './styles.module.scss'


interface ParamState {
    id: (number | string),
    name: string,
}

interface ParamProps {
    addParam: (arg: (ParamState | undefined)) => (() => void) | undefined,
    addParamValues: (arg: ParamValueState) => void,
    value: ParamState
}

interface arr {
    HTML?: HTMLTableElement,
    id: (number | string),
    paramValue?: string,
}

interface ParamValueState {
    paramValue: string,
    id: (number | string),

}

interface ParamValueProps {
    addParamValues: (arg: ParamValueState) => void,
    clearInput: () => void,
    id: (number | string)
}

class Param extends Component<ParamProps, ParamState> {
    state = {
        id: '',
        name: '',
    }

    onParamChange = (e: any) => {
        const name = e.target.value
        this.setState({ name }, this.props.addParam(this.state))
    }

    onIdChange = (e: any):void => {
        const id = e.target.value
        this.setState({ id })
    }

    clearInput = () => {
        this.setState({ name: '' })
        this.setState({ id: '' })
    }

    render() {
        return (
            <div className={styles.form}>
                <label htmlFor="id" className="form-label" >ID</label>
                <input type="number" className={styles.form__input}  placeholder="any number" name="id" value={this.state.id} onChange={this.onIdChange} />
                <label htmlFor="param" className={styles.form__label}>Param</label>
                <input
                    type="text"
                    placeholder="param"
                    className={styles.form__input}



                    name="param"
                    value={this.state.name}
                    onChange={this.onParamChange}
                />

                <ParamValue id={this.state.id} addParamValues={this.props.addParamValues} clearInput={this.clearInput}/>
            </div>
        )
    }
}

class ParamValue extends Component<ParamValueProps, ParamValueState> {
    state = {
        paramValue: '',
        id: '',
    }

    onParamValueChange = (e: any):void => {
        const paramValue = e.target.value
        this.setState({ paramValue })
        this.setState({ id: this.props.id })
    }

    clearInput = ():void => {
        this.setState({ paramValue: '' })
        this.setState({ id: '' })
        this.props.clearInput()
    }

    handleClick = ():void => {
        this.props.addParamValues(this.state)
        this.clearInput()
    }

    render() {
        return (
            <div className={styles.form}>
                <label htmlFor="paramValue" className={styles.form__label} >ParamValue</label>
                <input type="text"  className={styles.form__input} placeholder="paramValue" name="paramValue" onChange={this.onParamValueChange} value={this.state.paramValue}/>
                <button onClick={this.handleClick}  className={styles.form__button}>add Params</button>
            </div>
        )
    }
}

class Model extends Component<{ paramsValues: arr[] }, {}> {
    renderParamValue = (arr: arr[]) => {
        return arr.map(item => {
            return (
                <tr key={item.id}>
                    <td>
                        {item.id}
                    </td>
                    <td>
                        {item.paramValue}
                    </td>
                </tr>
            )
        })
    }
    render() {
        return (
            <div className={styles.form__table}>
                <h5>Model is</h5>
                <table>
                    <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">paramValue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.renderParamValue(this.props.paramsValues)}
                    </tbody>
                </table>

            </div>
        )
    }
}

interface ParamEditorState {
    paramValue: ParamValueState[],
    param: ParamState[],
    getModel: boolean
}

class ParamEditor extends Component<{ render: (arg: any) => void }, ParamEditorState> {
    state = {
        paramValue: [],
        param: [],
        getModel: false,
    }

    addParam = (val: ParamState): void => {
        this.setState({ param: [...this.state.param, val] }, () => {})
    }

    addParamValues = (val: ParamValueState): void => {
        this.setState({ paramValue: [...this.state.paramValue, val] }, () => {})
    }

    handleModel = ():void => {
        this.setState({ getModel: true }, () => {})
    }

    render() {
        return (
            // @ts-ignore
            <div className="container">
                {/* @ts-ignore */}
                <Param addParam={this.addParam} addParamValues={this.addParamValues} />
                <button className={styles.form__button} onClick={this.handleModel}>Get Model</button>
                {this.state.getModel ? this.props.render(this.state.paramValue) : null}
            </div>
        )
    }
}

class App extends Component {
    render() {
        return <ParamEditor render={paramsValues => <Model paramsValues={paramsValues} />} />
    }
}
ReactDOM.render(<App />, document.getElementById('root'))