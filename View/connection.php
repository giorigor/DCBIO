<?php

    header("Content-type: text/html; charset=latin1");

    function connect()
    {
        // DB connection info
        $host = "br-cdbr-azure-south-b.cloudapp.net";
        $user = "bb54adf3421fdd";
        $pwd = "f91c78c0";
        $db = "dcbiodb";
        try{
            $conn = new PDO( "mysql:host=$host;dbname=$db", $user, $pwd);
            $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
        }
        catch(Exception $e){
            die(print_r($e));
        }
        return $conn;
    }

    function phpQuery($string){
        $conn = connect();
        $sql = "?";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(1, $string);
        $stmt = $conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_NUM);
    }

    function getAllCampus()
    {
        $conn = connect();
        $sql = "SELECT * FROM tbl_campus";
        $stmt = $conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_NUM);
    }

//    TEMPLATE ADD ITEM
//    function addItem($name, $category, $date, $is_complete)
//    {
//        $conn = connect();
//        $sql = "INSERT INTO items (name, category, date, is_complete) VALUES (?, ?, ?, ?)";
//        $stmt = $conn->prepare($sql);
//        $stmt->bindValue(1, $name);
//        $stmt->bindValue(2, $category);
//        $stmt->bindValue(3, $date);
//        $stmt->bindValue(4, $is_complete);
//        $stmt->execute();
//    }

//    TEMPLATE REMOVE ITEM
//    function deleteItem($item_id)
//    {
//        $conn = connect();
//        $sql = "DELETE FROM items WHERE id = ?";
//        $stmt = $conn->prepare($sql);
//        $stmt->bindValue(1, $item_id);
//        $stmt->execute();
//    }
?>