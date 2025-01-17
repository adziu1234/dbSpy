import React from 'react';
import { Handle, Position } from 'reactflow';
import { useState, useRef, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import useFlowStore from '../../store/flowStore';
import createInitialEdges from './Edges';
import createInitialNodes from './Nodes';
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaRegSave,
  FaRegCheckSquare,
  FaRegWindowClose,
} from 'react-icons/fa';

export default function TableNodeRow({ row, id }) {
  const { schemaStore, setSchemaStore, reference, setReference } = useSchemaStore(
    (state) => state
  );
  const { edges, setEdges, nodes, setNodes } = useFlowStore((state) => state);
  const { editRefMode, setEditRefMode } = useSettingsStore((state) => state);
  const [defaultMode, setDefaultMode] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const selectedRow = useRef();
  const field_name = useRef();
  const data_type = useRef();
  const additional_constraints = useRef();
  const IsPrimaryKey = useRef();
  const IsForeignKey = useRef();

  //HELPER FUNCTIONS
  const inDefaultMode = () => {
    setDefaultMode(true);
    setEditMode(false);
    setDeleteMode(false);
  };

  const inEditMode = () => {
    setEditMode(true);
    setDefaultMode(false);
    setDeleteMode(false);
  };

  const inDeleteMode = () => {
    setDeleteMode(true);
    setDefaultMode(false);
    setEditMode(false);
  };

  const onSave = () => {
    const defaultRef = [
      {
        PrimaryKeyName: '',
        ReferencesPropertyName: '',
        PrimaryKeyTableName: '',
        ReferencesTableName: '',
        IsDestination: '',
        constrainName: '',
      },
    ];
    //declare prior values
    const tableRef = row.TableName;
    const rowRef = row.field_name;
    const currentSchema = { ...schemaStore };
    currentSchema[tableRef][rowRef].Name = field_name.current.value;
    currentSchema[tableRef][rowRef].Value = null;
    currentSchema[tableRef][rowRef].TableName = tableRef;
    currentSchema[tableRef][rowRef].References =
      IsForeignKey.current.value === 'true' ? reference : defaultRef;
    currentSchema[tableRef][rowRef].field_name = field_name.current.value.replaceAll(
      ' ',
      '_'
    );
    currentSchema[tableRef][rowRef].data_type = data_type.current.value;
    currentSchema[tableRef][rowRef].additional_constraints =
      additional_constraints.current.value;
    currentSchema[tableRef][rowRef].IsPrimaryKey = IsPrimaryKey.current.value === 'true';
    currentSchema[tableRef][rowRef].IsForeignKey = IsForeignKey.current.value === 'true';
    //set reference back to defaultRef
    setReference(defaultRef);
    //check if row name has changed
    if (rowRef !== field_name.current.value) {
      currentSchema[tableRef][field_name.current.value.replaceAll(' ', '_')] =
        currentSchema[tableRef][rowRef];
      delete currentSchema[tableRef][rowRef];
    }
    //set new values to the schemaStore
    setSchemaStore(currentSchema);
    //set new nodes/edges if a new reference is added
    // if(reference.length > 0) {
    const initialEdges = createInitialEdges(currentSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(currentSchema, initialEdges);
    setNodes(initialNodes);
    // }
    setDefaultMode();
    alert('Click EDIT then SAVE on the target table row.');
  };

  const onDelete = () => {
    //declare prior values
    const tableRef = row.TableName;
    const rowRef = row.field_name;
    const currentSchema = { ...schemaStore };
    delete currentSchema[tableRef][rowRef];
    setSchemaStore(currentSchema);
  };


  // console.log('Im in tableNodeRow, here is row data: ', row);
  return (
    <>
      <tr
        ref={selectedRow}
        key={row.field_name}
        id={row.field_name}
        className="dark:text-[#f8f4eb] "
      >
        <td className="dark:text-[#f8f4eb]" id={`${id}-field_name`}>
          {editMode || row.field_name === 'newRow' ? (
            <input
              ref={field_name}
              className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black"
              defaultValue={row.field_name}
            ></input>
          ) : (
            row.field_name
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-data_type`}>
          {editMode || row.field_name === 'newRow' ? (
            <select
              ref={data_type}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.data_type}
            >
              <option value="binary">binary</option>
              <option value="blob">blob</option>
              <option value="boolean">boolean</option>
              <option value="date">date</option>
              <option value="datetime">datetime</option>
              <option value="decimal">decimal</option>
              <option value="float">float</option>
              <option value="integer">integer</option>
              <option value="serial">serial</option>
              <option value="text">text</option>
              <option value="time">time</option>
              <option value="timestamp">timestamp</option>
              <option value="varchar">varchar</option>
            </select>
          ) : (
            row.data_type
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-additional_constraints`}>
          {editMode || row.field_name === 'newRow' ? (
            <select
              ref={additional_constraints}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.additional_constraints}
            >
              <option value="NA">NA</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="UNIQUE">UNIQUE</option>
            </select>
          ) : (
            row.additional_constraints
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsPrimaryKey`}>
          {editMode || row.field_name === 'newRow' ? (
            <select
              ref={IsPrimaryKey}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.IsPrimaryKey ? 'true' : 'false'}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            row.IsPrimaryKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsForeignKey`}>
          {editMode || row.field_name === 'newRow' ? (
            <select
              ref={IsForeignKey}
              onChange={(e) => {
                // console.log('ONCHANGE TO TRUE', e.target.value);
                const defaultRef = [
                  {
                    PrimaryKeyName: '',
                    ReferencesPropertyName: '',
                    PrimaryKeyTableName: '',
                    ReferencesTableName: '',
                    IsDestination: '',
                    constrainName: '',
                  },
                ];
                if (e.target.value === 'true') {
                  //expose Add Reference modal
                  document.querySelector('#mySideNav').style.width = '400px';
                  document.querySelector('#main').style.marginRight = '400px';
                  setEditRefMode(true);
                  if (row.References.length === 0) setReference(defaultRef);
                  else setReference([row.References[0]]);
                }
              }}
              className="bg-[#f8f4eb] dark:text-black"
              defaultValue={row.IsForeignKey ? 'true' : 'false'}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            row.IsForeignKey.toString()
          )}
        </td>
        <td className="dark:text-[#f8f4eb]">
          {editMode || row.field_name === 'newRow' ? (
            <button
              id={`${id}-saveBtn`}
              onClick={() => {
                onSave();
                inDefaultMode();
              }}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegSave size={17} />
            </button>
          ) : deleteMode ? (
            <button
              id={`${id}-confirmBtn`}
              onClick={() => {
                onDelete();
                inDefaultMode();
              }}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegCheckSquare size={17} />
            </button>
          ) : (
            <button
              id={`${id}-editBtn`}
              onClick={inEditMode}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegEdit size={17} />
            </button>
          )}
        </td>
        <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
          {editMode ? (
            <button id={`${id}-cancelBtn`} onClick={inDefaultMode}>
              <FaRegWindowClose size={17} />
            </button>
          ) : editMode || row.field_name === 'newRow' ? (
            <button
              id={`${id}-cancelBtn`}
              onClick={() => {
                onDelete();
                inDefaultMode();
              }}
            >
              <FaRegWindowClose size={17} />
            </button>
          ) : deleteMode ? (
            <button id={`${id}-cancelBtn`} onClick={inDefaultMode}>
              <FaRegWindowClose size={17} />
            </button>
          ) : (
            <button id={`${id}-deleteBtn`} onClick={inDeleteMode}>
              <FaRegTrashAlt size={17} />
            </button>
          )}
        </td>
      </tr>
    </>
  );
}
